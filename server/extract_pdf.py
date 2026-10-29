import re
import io
import pandas as pd
import pdfplumber


def _format_number(x):
    """Format a numeric string: swap Brazilian decimal separators to standard."""
    if isinstance(x, float):
        return f"{x:,.2f}"
    if isinstance(x, str):
        return x.replace(".", "temp").replace(",", ".").replace("temp", ",")
    return str(x)


def _extract_manufacture_date_from_certificate(lot_number, certificate_file):
    """Search a certificate PDF for the manufacture date of a given lot number."""
    if certificate_file is None:
        return ""

    man_date_pattern = re.compile(r"(\d{2}\.\d{2}\.\d{4})")

    try:
        with pdfplumber.open(certificate_file) as pdf:
            for page in pdf.pages:
                text = page.extract_text()
                if not text:
                    continue
                for line in text.split("\n"):
                    if str(lot_number) in line:
                        match = man_date_pattern.search(line)
                        if match:
                            return match.group(1)
    except Exception:
        pass

    return ""


def extract_items_from_invoice(invoice_file, certificate_file=None, progress_cb=None):
    """
    Parse an invoice PDF and return a pandas DataFrame with the extracted rows.

    Args:
        invoice_file: file-like object or path for the invoice PDF.
        certificate_file: optional file-like object or path for the certificate PDF.
        progress_cb: optional callable(current, total, message) for progress updates.

    Returns:
        pd.DataFrame or None if no data was found.
    """
    lot_pattern = re.compile(r"(\bU\d+\b)")
    lot_qty_pattern = re.compile(r"Quantity:\s*(\d+)")
    man_date_pattern = re.compile(r"Manufacturing Date:\s*(\d{2}\.\d{2}\.\d{2})")

    current_line = None
    data_rows = []

    with pdfplumber.open(invoice_file) as pdf:
        total_pages = len(pdf.pages)
        if progress_cb:
            progress_cb(0, total_pages, f"Processing {total_pages} page(s)...")

        for page_number, page in enumerate(pdf.pages, start=1):
            text = page.extract_text()
            if not text:
                if progress_cb:
                    progress_cb(page_number, total_pages, f"Page {page_number}/{total_pages} — no text")
                continue

            lines = text.split("\n")
            i = 0

            while i < len(lines):
                line = lines[i]

                if "CS" in line:
                    parts = line.split()
                    product = f"{parts[1]} {parts[2]}" if len(parts) > 2 else ""
                    quantity = parts[3] if len(parts) > 3 else "0"
                    unit_price = parts[5] if len(parts) > 5 else "0"
                    amount = parts[6] if len(parts) > 6 else "0"

                    i += 1
                    description = ""
                    while i < len(lines) and "Tariff" not in lines[i]:
                        description += lines[i].rstrip(",") + " "
                        i += 1

                    if current_line is not None:
                        data_rows.append(current_line)

                    current_line = {
                        "PRODUCT": product,
                        "DESCRIPTION": description.strip(),
                        "QUANTITY": quantity,
                        "UNIT PRICE": unit_price,
                        "AMOUNT": amount,
                        "LOTS": "",
                        "MANUFACTURE DATES": "",
                    }

                elif "Lot:" in line:
                    lot_match = lot_pattern.search(line)
                    lot_qty_match = lot_qty_pattern.search(line)
                    man_date_match = man_date_pattern.search(line)

                    parts = line.split()

                    current_lot = ""
                    if lot_match:
                        current_lot = lot_match.group(1).rstrip(",")
                    elif "Lot:" in parts:
                        idx = parts.index("Lot:")
                        if idx + 1 < len(parts):
                            current_lot = parts[idx + 1].rstrip(",")

                    current_qty = ""
                    if lot_qty_match:
                        current_qty = lot_qty_match.group(1)
                    elif "Quantity:" in parts:
                        idx = parts.index("Quantity:")
                        if idx + 1 < len(parts):
                            current_qty = parts[idx + 1].rstrip(",")

                    current_man_date = ""
                    if man_date_match:
                        current_man_date = man_date_match.group(1)
                    elif certificate_file and current_lot:
                        current_man_date = _extract_manufacture_date_from_certificate(
                            current_lot, certificate_file
                        )

                    # Append quantity suffix when the next line is also a lot line
                    next_is_lot = (
                        i + 1 < len(lines) and "Lot:" in lines[i + 1]
                    )
                    if current_qty and next_is_lot:
                        current_lot = f"{current_lot} x{current_qty}"

                    if current_line is not None:
                        current_line["LOTS"] += current_lot + "\n"
                        current_line["MANUFACTURE DATES"] += current_man_date + "\n"

                i += 1

            if progress_cb:
                progress_cb(page_number, total_pages, f"Processed page {page_number}/{total_pages}")

    if current_line is not None:
        data_rows.append(current_line)

    if not data_rows:
        return None

    df = pd.DataFrame(
        data_rows,
        columns=["PRODUCT", "DESCRIPTION", "QUANTITY", "UNIT PRICE", "AMOUNT", "LOTS", "MANUFACTURE DATES"],
    )

    # Clean QUANTITY column
    df["QUANTITY"] = df["QUANTITY"].str.replace("PCS", "", regex=False).str.strip()
    df["QUANTITY"] = pd.to_numeric(df["QUANTITY"], errors="coerce")

    # Normalize number formatting
    df["UNIT PRICE"] = df["UNIT PRICE"].apply(_format_number)
    df["AMOUNT"] = df["AMOUNT"].apply(_format_number)

    # Strip trailing newlines in multi-line cells
    df["LOTS"] = df["LOTS"].str.strip()
    df["MANUFACTURE DATES"] = df["MANUFACTURE DATES"].str.strip()

    df.index += 1
    return df


def dataframe_to_excel_bytes(df: pd.DataFrame) -> bytes:
    """Serialize a DataFrame to an in-memory .xlsx file and return the raw bytes."""
    buf = io.BytesIO()
    df.to_excel(buf, index=True)
    buf.seek(0)
    return buf.read()

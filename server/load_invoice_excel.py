import pandas as pd


def load_invoice_excel(path):
    df = pd.read_excel(path)
    df.columns = [str(c).strip() for c in df.columns]

    # Flexible column mapping (case-insensitive)
    col_map = {}
    for col in df.columns:
        upper = col.upper()
        if upper in ("REFERENCE", "REF", "SKU", "PART NO", "PART NUMBER"):
            col_map[col] = "reference"
        elif upper in ("DESCRIPTION", "DESC", "PRODUCT", "ITEM", "NAME"):
            col_map[col] = "description"
        elif upper in ("QUANTITY", "QTY", "UNITS"):
            col_map[col] = "qty"
        elif upper in ("UNIT PRICE", "PRICE", "UNIT COST", "UNIT_PRICE", "RATE"):
            col_map[col] = "unit_price"

    df = df.rename(columns=col_map)
    df = df.dropna(subset=["reference"])

    df["reference"] = df["reference"].astype(str).str.replace(r"\.0$", "", regex=True)
    df["description"] = df.get("description", pd.Series([""] * len(df))).fillna("").astype(str)
    df["qty"] = pd.to_numeric(df["qty"], errors="coerce").fillna(0).astype(int)
    df["unit_price"] = pd.to_numeric(df["unit_price"], errors="coerce").fillna(0.0)
    df["amount"] = df["qty"] * df["unit_price"]

    return df

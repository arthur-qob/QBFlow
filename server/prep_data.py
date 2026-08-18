import math
from parse_lots import parse_lot_cell


def _is_empty(val):
    """Return True if val is None, NaN, or an empty/whitespace string."""
    if val is None:
        return True
    if isinstance(val, float) and math.isnan(val):
        return True
    if isinstance(val, str) and not val.strip():
        return True
    return False


def prepare_data(df):
    total_skus = len(df)
    total_units = 0

    rows = []
    for _, row in df.iterrows():
        row_dict = row.to_dict()
        parsed = parse_lot_cell(row_dict.get("lots", ""))

        uses_parsed_format = any(
            entry["manufacture_date"] is not None or entry["qty"] is not None
            for entry in parsed
        )

        qty_missing = _is_empty(row_dict.get("qty"))

        if uses_parsed_format:
            lot_lines = []
            date_lines = []
            sheet_date = row_dict.get("manufacture_dates", "")
            for entry in parsed:
                lot_lines.append(
                    f"{entry['lot']} x{entry['qty']}" if entry["qty"] is not None else entry["lot"]
                )
                # Sheet date takes priority; fall back to lot-derived date when empty
                date_lines.append(
                    sheet_date if not _is_empty(sheet_date)
                    else entry["manufacture_date"] if entry["manufacture_date"] is not None
                    else ""
                )
            r = dict(row_dict)
            r["lots"] = "\n".join(lot_lines)
            r["manufacture_dates"] = "\n".join(date_lines)
            # Derive qty from lots when the qty cell was empty
            if qty_missing:
                r["qty"] = sum(e["qty"] for e in parsed if e["qty"] is not None)
            else:
                r["qty"] = int(row_dict["qty"])
            rows.append(r)
        else:
            r = dict(row_dict)
            r["qty"] = 0 if qty_missing else int(row_dict["qty"])
            rows.append(r)

        total_units += r["qty"]

    return {
        "rows": rows,
        "total_skus": total_skus,
        "total_units": total_units,
    }

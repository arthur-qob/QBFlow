from parse_lots import parse_lot_cell


def prepare_data(df):
    total_skus = len(df)

    rows = []
    for _, row in df.iterrows():
        row_dict = row.to_dict()
        parsed = parse_lot_cell(row_dict.get("lots", ""))

        uses_parsed_format = any(
            entry["manufacture_date"] is not None or entry["qty"] is not None
            for entry in parsed
        )

        if uses_parsed_format:
            for entry in parsed:
                r = dict(row_dict)
                r["lots"] = f"{entry['lot']} x{entry['qty']}" if entry["qty"] is not None else entry["lot"]
                if entry["manufacture_date"] is not None:
                    r["manufacture_dates"] = entry["manufacture_date"]
                if entry["qty"] is not None:
                    r["qty"] = entry["qty"]
                rows.append(r)
        else:
            rows.append(row_dict)

    total_units = sum(r["qty"] for r in rows)

    return {
        "rows": rows,
        "total_skus": total_skus,
        "total_units": int(total_units),
    }

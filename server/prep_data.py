from parse_lots import parse_lot_cell


def prepare_data(df):
    total_skus = len(df)
    total_units = int(df["qty"].sum())

    rows = []
    for _, row in df.iterrows():
        row_dict = row.to_dict()
        parsed = parse_lot_cell(row_dict.get("lots", ""))

        uses_parsed_format = any(
            entry["manufacture_date"] is not None or entry["qty"] is not None
            for entry in parsed
        )

        if uses_parsed_format:
            lot_lines = []
            date_lines = []
            for entry in parsed:
                lot_lines.append(
                    f"{entry['lot']} x{entry['qty']}" if entry["qty"] is not None else entry["lot"]
                )
                date_lines.append(
                    entry["manufacture_date"] if entry["manufacture_date"] is not None
                    else row_dict.get("manufacture_dates", "")
                )
            r = dict(row_dict)
            r["lots"] = "\n".join(lot_lines)
            r["manufacture_dates"] = "\n".join(date_lines)
            rows.append(r)
        else:
            rows.append(row_dict)

    return {
        "rows": rows,
        "total_skus": total_skus,
        "total_units": total_units,
    }

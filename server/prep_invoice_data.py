def prepare_invoice_data(df, shipping=0.0):
    rows = []
    for _, row in df.iterrows():
        rows.append({
            "reference": row["reference"],
            "description": row.get("description", ""),
            "qty": int(row["qty"]),
            "unit_price": f"{row['unit_price']:,.2f}",
            "amount": f"{row['amount']:,.2f}",
        })

    subtotal = df["amount"].sum()
    total = subtotal + shipping

    return {
        "rows": rows,
        "total_skus": len(df),
        "total_units": int(df["qty"].sum()),
        "subtotal": f"{subtotal:,.2f}",
        "shipping": f"{shipping:,.2f}",
        "total": f"{total:,.2f}",
        "balance_due": f"{total:,.2f}",
    }

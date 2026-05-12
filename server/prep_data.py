def prepare_data(df):
    rows = df.to_dict(orient="records")

    total_skus = len(df)
    total_units = df["qty"].sum()

    return {
        "rows": rows,
        "total_skus": total_skus,
        "total_units": total_units
    }
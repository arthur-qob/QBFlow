import pandas as pd
from datetime import datetime


def _format_day_month_year(val):
    if pd.isna(val) or val == "":
        return ""
    if hasattr(val, "strftime"):
        return val.strftime("%m.%d.%Y")
    val_str = str(val).strip()
    for fmt in ["%m/%d/%Y", "%d/%m/%Y", "%Y-%m-%d", "%d-%m-%Y", "%m-%d-%Y",
                "%d.%m.%Y", "%m.%d.%Y", "%B %d, %Y", "%b %d, %Y"]:
        try:
            return datetime.strptime(val_str, fmt).strftime("%m.%d.%Y")
        except ValueError:
            pass
    return val_str


def _format_month_year(val):
    if pd.isna(val) or val == "":
        return ""
    if hasattr(val, "strftime"):
        return val.strftime("%m/%Y")
    val_str = str(val).strip()
    for fmt in ["%m/%Y", "%m-%Y", "%Y-%m", "%b %Y", "%B %Y",
                "%m/%d/%Y", "%d/%m/%Y", "%Y-%m-%d", "%d-%m-%Y"]:
        try:
            return datetime.strptime(val_str, fmt).strftime("%m/%Y")
        except ValueError:
            pass
    return val_str


def load_excel(path, date_format="day_month_year"):
    df = pd.read_excel(path)

    df = df.dropna(subset=["PRODUCT"])

    df = df.rename(columns={
        "PRODUCT": "reference",
        "LOTS": "lots",
        "MANUFACTURE DATES": "manufacture_dates",
        "QUANTITY": "qty"
    })

    df["reference"] = df["reference"].astype(str).str.replace(r'\.0$', '', regex=True)

    if date_format == "month_year":
        df["manufacture_dates"] = df["manufacture_dates"].apply(_format_month_year)
    else:
        df["manufacture_dates"] = df["manufacture_dates"].apply(_format_day_month_year)

    df["qty"] = df["qty"].astype(int)

    if "NET WEIGHT" in df.columns:
        df = df.rename(columns={"NET WEIGHT": "net_weight_per_item"})
    else:
        df["net_weight_per_item"] = ""

    return df
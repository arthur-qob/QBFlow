import pandas as pd
from prep_data import prepare_data


def _make_df(**kwargs):
    defaults = {
        "reference": ["REF1"],
        "lots": ["AC2402(4)"],
        "manufacture_dates": [""],
        "qty": [4],
        "net_weight_per_item": [""],
    }
    defaults.update(kwargs)
    return pd.DataFrame(defaults)


def test_single_lot_single_row():
    df = _make_df(lots=["AC2402(4)"], qty=[4], manufacture_dates=["01/2024"])
    data = prepare_data(df)
    assert len(data["rows"]) == 1
    assert data["rows"][0]["lots"] == "AC2402 x4"
    # Sheet date takes priority over lot-derived date
    assert data["rows"][0]["manufacture_dates"] == "01/2024"
    assert data["total_units"] == 4
    assert data["total_skus"] == 1


def test_lot_date_used_when_sheet_date_empty():
    """When sheet manufacture_dates is empty, fall back to lot-derived date."""
    df = _make_df(lots=["AC2402(4)"], qty=[4], manufacture_dates=[""])
    data = prepare_data(df)
    assert data["rows"][0]["manufacture_dates"] == "02/2024"


def test_multiple_lots_stay_in_one_row():
    df = _make_df(lots=["AC2402(4); AC2410(1)"], qty=[5], manufacture_dates=["03/2024"])
    data = prepare_data(df)
    assert len(data["rows"]) == 1
    assert data["rows"][0]["lots"] == "AC2402 x4\nAC2410 x1"
    # Single sheet date is used for all lot entries in the row
    assert data["rows"][0]["manufacture_dates"] == "03/2024\n03/2024"
    assert data["total_units"] == 5


def test_multiple_lots_lot_dates_when_sheet_empty():
    """With empty sheet date, each lot entry provides its own derived date."""
    df = _make_df(lots=["AC2402(4); AC2410(1)"], qty=[5], manufacture_dates=[""])
    data = prepare_data(df)
    assert data["rows"][0]["manufacture_dates"] == "02/2024\n10/2024"


def test_unrecognized_lot_passes_through():
    df = _make_df(lots=["SOMETEXT"], manufacture_dates=["01.01.2024"], qty=[3])
    data = prepare_data(df)
    assert len(data["rows"]) == 1
    assert data["rows"][0]["lots"] == "SOMETEXT"
    assert data["rows"][0]["manufacture_dates"] == "01.01.2024"


def test_multiple_references_each_one_row():
    df = pd.DataFrame({
        "reference": ["REF1", "REF2"],
        "lots": ["AC2402(4); AC2410(1)", "BC2405(3)"],
        "manufacture_dates": ["", ""],
        "qty": [5, 3],
        "net_weight_per_item": ["", ""],
    })
    data = prepare_data(df)
    assert len(data["rows"]) == 2
    assert data["total_skus"] == 2
    assert data["total_units"] == 8


# --- Tests for lot-derived qty / manufacture_dates ---

def test_qty_derived_from_lot_when_missing():
    """Qty column absent: quantity should come from the lot parenthetical."""
    df = _make_df(lots=["AD2412(2)"], qty=[float("nan")])
    data = prepare_data(df)
    assert data["rows"][0]["qty"] == 2
    assert data["total_units"] == 2


def test_manufacture_date_derived_from_lot_when_missing():
    """manufacture_dates column empty: date should be derived from lot code."""
    df = _make_df(lots=["AD2412(2)"], manufacture_dates=[""], qty=[2])
    data = prepare_data(df)
    assert data["rows"][0]["manufacture_dates"] == "12/2024"


def test_sheet_date_takes_priority_over_lot_date():
    """When sheet date is provided it should override the lot-derived date."""
    df = _make_df(lots=["AD2412(2)"], manufacture_dates=["06/2025"], qty=[2])
    data = prepare_data(df)
    assert data["rows"][0]["manufacture_dates"] == "06/2025"


def test_partial_manufacture_dates():
    """Rows with a sheet date use it; rows without fall back to the lot date."""
    df = pd.DataFrame({
        "reference": ["REF1", "REF2"],
        "lots": ["AC2402(4)", "BC2405(3)"],
        "manufacture_dates": ["01/2024", ""],  # REF1 has a date, REF2 doesn't
        "qty": [4, 3],
        "net_weight_per_item": ["", ""],
    })
    data = prepare_data(df)
    assert data["rows"][0]["manufacture_dates"] == "01/2024"  # sheet date
    assert data["rows"][1]["manufacture_dates"] == "05/2024"  # lot-derived


def test_both_derived_from_lot_when_columns_missing():
    """Both qty and manufacture_dates absent: both come from the lot."""
    df = _make_df(lots=["AD2412(2)"], manufacture_dates=[""], qty=[float("nan")])
    data = prepare_data(df)
    assert data["rows"][0]["qty"] == 2
    assert data["rows"][0]["manufacture_dates"] == "12/2024"
    assert data["total_units"] == 2

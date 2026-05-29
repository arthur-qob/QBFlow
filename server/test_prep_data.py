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
    df = _make_df(lots=["AC2402(4)"], qty=[4])
    data = prepare_data(df)
    assert len(data["rows"]) == 1
    assert data["rows"][0]["lots"] == "AC2402 x4"
    assert data["rows"][0]["manufacture_dates"] == "02.2024"
    assert data["total_units"] == 4
    assert data["total_skus"] == 1


def test_multiple_lots_stay_in_one_row():
    df = _make_df(lots=["AC2402(4); AC2410(1)"], qty=[5])
    data = prepare_data(df)
    assert len(data["rows"]) == 1
    assert data["rows"][0]["lots"] == "AC2402 x4\nAC2410 x1"
    assert data["rows"][0]["manufacture_dates"] == "02.2024\n10.2024"
    assert data["total_units"] == 5


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

import pytest
from parse_lots import parse_lot_cell


def test_single_lot_with_qty():
    assert parse_lot_cell("AC2402(4)") == [
        {"lot": "AC2402", "qty": 4, "manufacture_date": "02/2024"},
    ]


def test_multiple_lots():
    assert parse_lot_cell("AC2402(4); AC2410(1)") == [
        {"lot": "AC2402", "qty": 4, "manufacture_date": "02/2024"},
        {"lot": "AC2410", "qty": 1, "manufacture_date": "10/2024"},
    ]


def test_extra_spaces():
    assert parse_lot_cell("  AC2402(4)  ;  AC2410(1)  ") == [
        {"lot": "AC2402", "qty": 4, "manufacture_date": "02/2024"},
        {"lot": "AC2410", "qty": 1, "manufacture_date": "10/2024"},
    ]


def test_single_lot_without_qty():
    assert parse_lot_cell("AC2402") == [
        {"lot": "AC2402", "qty": None, "manufacture_date": "02/2024"},
    ]


def test_invalid_format():
    assert parse_lot_cell("SOMETEXT") == [
        {"lot": "SOMETEXT", "qty": None, "manufacture_date": None},
    ]


def test_empty_string():
    assert parse_lot_cell("") == [
        {"lot": "", "qty": None, "manufacture_date": None},
    ]


def test_none_value():
    assert parse_lot_cell(None) == [
        {"lot": "", "qty": None, "manufacture_date": None},
    ]


def test_lowercase_preserves_case():
    # Lot codes are stored as-is (case-sensitive); ac2402 ≠ AC2402
    result = parse_lot_cell("ac2402(4)")
    assert result == [
        {"lot": "ac2402", "qty": 4, "manufacture_date": "02/2024"},
    ]


def test_flexible_lot_format():
    # Real-world format: alphanumeric codes with qty in parens, dates from sheet
    result = parse_lot_cell("b3r(2); b5S(13)")
    assert result == [
        {"lot": "b3r", "qty": 2, "manufacture_date": None},
        {"lot": "b5S", "qty": 13, "manufacture_date": None},
    ]


def test_many_lots():
    result = parse_lot_cell("AC2402(4); AC2410(1); AC2501(2)")
    assert len(result) == 3
    assert result[2] == {"lot": "AC2501", "qty": 2, "manufacture_date": "01/2025"}


def test_invalid_month_returns_none_date():
    # MM=13 is invalid
    result = parse_lot_cell("AC2413(2)")
    assert result[0]["manufacture_date"] is None

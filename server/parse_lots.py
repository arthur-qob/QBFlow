import re

# Matches: any alphanumeric lot code followed by optional (qty), e.g. "b3r(2)", "aDN(24)", "AC2402(4)"
_FLEXIBLE_PATTERN = re.compile(r'^([A-Za-z0-9]+)\s*(?:\((\d+)\))?$')

# Matches the strict original format: 2 letters + 2-digit year + 2-digit month + optional (qty)
# Used only to derive manufacture_date from the lot code itself
_DERIVE_PATTERN = re.compile(r'^([A-Za-z]{2})(\d{2})(\d{2})$')


def parse_lot_cell(value):
    """
    Parse a lot cell into a list of entries.

    Supported formats (semicolon-separated):
      - "b3r(2); b5S(13)"          — alphanumeric code + qty in parens
      - "AC2402(4); AC2410(1)"     — 2-letter + YYMM code (manufacture date auto-derived)
      - "b78(50)"                  — single entry
      - bare codes without qty     — qty=None

    Returns a list of dicts:
      {
        "lot": str,                 lot code without parentheses, e.g. "b3r"
        "qty": int or None,         quantity from parentheses, or None if absent
        "manufacture_date": str or None,  "MM/YYYY" derived from YYMM codes, or None
      }
    """
    if value is None or (isinstance(value, float) and value != value):
        return [{"lot": "", "qty": None, "manufacture_date": None}]

    value = str(value).strip()
    if not value:
        return [{"lot": "", "qty": None, "manufacture_date": None}]

    results = []
    for part in value.split(";"):
        part = part.strip()
        if not part:
            continue
        m = _FLEXIBLE_PATTERN.match(part)
        if m:
            lot = m.group(1)
            qty = int(m.group(2)) if m.group(2) is not None else None
            # Try to derive manufacture_date if the lot code looks like XXYYMM
            manufacture_date = _try_derive_date(lot)
            results.append({"lot": lot, "qty": qty, "manufacture_date": manufacture_date})
        else:
            results.append({"lot": part, "qty": None, "manufacture_date": None})

    return results if results else [{"lot": value, "qty": None, "manufacture_date": None}]


def _try_derive_date(lot_code):
    """Derive MM/YYYY from a lot code that matches the XXYYMM pattern."""
    m = _DERIVE_PATTERN.match(lot_code)
    if m:
        return _derive_date(m.group(2), m.group(3))
    return None


def _derive_date(yy, mm):
    try:
        year = 2000 + int(yy)
        month = int(mm)
        if 1 <= month <= 12:
            return f"{month:02d}/{year}"
    except ValueError:
        pass
    return None

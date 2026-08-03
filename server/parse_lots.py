import re

_ENTRY_PATTERN = re.compile(r'^([A-Za-z]{2})(\d{2})(\d{2})\s*(?:\((\d+)\))?$')


def parse_lot_cell(value):
    """
    Parse a lot cell into a list of entries.

    Recognized format: XXYYMM(qty) separated by semicolons, e.g. "AC2402(4); AC2410(1)"
      - XX   = 2 letters
      - YY   = 2-digit year
      - MM   = 2-digit month
      - (qty) = optional quantity in parentheses

    Returns a list of dicts:
      {
        "lot": str,              e.g. "AC2402"
        "qty": int or None,      quantity from parentheses, or None if absent
                "manufacture_date": str or None,  "MM/YYYY" derived from YYMM, or None
      }

    Unrecognized entries are returned as-is with qty=None and manufacture_date=None.
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
        m = _ENTRY_PATTERN.match(part)
        if m:
            lot = (m.group(1) + m.group(2) + m.group(3)).upper()
            qty = int(m.group(4)) if m.group(4) is not None else None
            manufacture_date = _derive_date(m.group(2), m.group(3))
            results.append({"lot": lot, "qty": qty, "manufacture_date": manufacture_date})
        else:
            results.append({"lot": part, "qty": None, "manufacture_date": None})

    return results if results else [{"lot": value, "qty": None, "manufacture_date": None}]


def _derive_date(yy, mm):
    try:
        year = 2000 + int(yy)
        month = int(mm)
        if 1 <= month <= 12:
            return f"{month:02d}/{year}"
    except ValueError:
        pass
    return None

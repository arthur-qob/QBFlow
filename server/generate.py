from load_excel import load_excel
from prep_data import prepare_data
from render_html import render_html
import os

if os.name == "nt":
    os.add_dll_directory(r"C:\Dev\GTK3-Runtime Win64\bin")

from weasyprint import HTML

BASE_DIR = os.path.dirname(os.path.abspath(__file__))


def generate_pdf(html):
    return HTML(
        string=html,
        base_url=os.path.join(BASE_DIR, "templates"),
    ).write_pdf()


def main():
    df = load_excel("input/packing.xlsx")
    data = prepare_data(df)
    html = render_html(data)
    pdf_bytes = generate_pdf(html)

    os.makedirs("output", exist_ok=True)
    with open("output/packing_slip.pdf", "wb") as f:
        f.write(pdf_bytes)

    print("Packing slip generated successfully.")


if __name__ == "__main__":
    main()

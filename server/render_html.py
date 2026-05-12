from jinja2 import Environment, FileSystemLoader

def render_html(data):
    env = Environment(
        loader=FileSystemLoader("templates")
    )

    template = env.get_template("packing_slip.html")

    html = template.render(**data)

    return html

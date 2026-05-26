import os
from jinja2 import Environment, FileSystemLoader

BASE_DIR = os.path.dirname(os.path.abspath(__file__))


def render_html(data, template_name="packing_slip.html"):
    env = Environment(
        loader=FileSystemLoader(os.path.join(BASE_DIR, "templates"))
    )
    template = env.get_template(template_name)
    return template.render(**data)

"""Lightweight preview of the homepage, using the original demo's rendered shell.
Not a Jekyll build: SCSS changes and arbitrary Liquid are not compiled here.
"""
from pathlib import Path
from http.server import SimpleHTTPRequestHandler, ThreadingHTTPServer
from functools import partial
import argparse
import html
import json
import shutil
import subprocess

ROOT = Path(__file__).resolve().parents[1]
OUTPUT = ROOT / "_site"

def build():
    data = json.loads(subprocess.check_output([
        "ruby", "-rjson", "-ryaml", "-e",
        "puts JSON.generate(ARGV.map { |f| YAML.load_file(f) })",
        str(ROOT / "_config.yml"), str(ROOT / "_data/navigation.yml")
    ], text=True))
    config, navigation = data
    source = (ROOT / "_pages/about.md").read_text()
    body = source.split("---", 2)[2].lstrip()
    if "{%" in body or "{{" in body:
        raise ValueError("This preview accepts HTML content only; use Jekyll for Liquid.")
    page = (ROOT / "_preview/shell.html").read_text()
    links = '<li class="masthead__menu-item masthead__menu-item--lg masthead__menu-home-item"><a href="#about-me">Homepage</a></li>'
    for link in navigation["main"]:
        target = link["url"]
        if target.startswith("/#"):
            target = target[1:]
        links += '<li class="masthead__menu-item"><a href="{}">{}</a></li>'.format(html.escape(target, quote=True), html.escape(link["title"]))
    for key, value in {
        "CONTENT": body, "NAV": links,
        "NAME": html.escape(config["author"]["name"]),
        "BIO": html.escape(config["author"]["bio"]),
        "PERSONAL_NOTE": html.escape(config["author"].get("personal_note", "")),
    }.items():
        page = page.replace("<!-- PREVIEW_" + key + " -->", value)
    OUTPUT.mkdir(exist_ok=True)
    for folder in ("assets", "images"):
        shutil.copytree(ROOT / folder, OUTPUT / folder, dirs_exist_ok=True)
    shutil.copy2(ROOT / "_preview/main.css", OUTPUT / "assets/css/main.css")
    (OUTPUT / "index.html").write_text(page)

class PreviewHandler(SimpleHTTPRequestHandler):
    def do_GET(self):
        if self.path.split("?", 1)[0] in ("/", "/index.html"):
            build()
        super().do_GET()
    def end_headers(self):
        self.send_header("Cache-Control", "no-store")
        super().end_headers()

if __name__ == "__main__":
    parser = argparse.ArgumentParser()
    parser.add_argument("--port", type=int, default=4001)
    parser.add_argument("--build-only", action="store_true")
    args = parser.parse_args()
    build()
    if not args.build_only:
        print(f"Preview: http://127.0.0.1:{args.port}/", flush=True)
        server = ThreadingHTTPServer(("127.0.0.1", args.port), partial(PreviewHandler, directory=str(OUTPUT)))
        try:
            server.serve_forever()
        except KeyboardInterrupt:
            pass
        finally:
            server.server_close()

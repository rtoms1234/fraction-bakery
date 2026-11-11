"""Wrap the artifact-format page (index.html) into a complete HTML document for static hosting.

Usage:  python build.py [REPORT_URL]
Writes docs/index.html (what GitHub Pages serves). If REPORT_URL is given it is baked into the page
so every device reports to the same Google Sheet without any per-device setup.
"""
import re
import sys
from pathlib import Path

HERE = Path(__file__).resolve().parent
SRC = HERE / "index.html"
OUT = HERE / "docs" / "index.html"

HEAD = (
    '<!doctype html><html lang="en"><head><meta charset="utf-8">'
    '<meta name="viewport" content="width=device-width,initial-scale=1,viewport-fit=cover">'
    '<meta name="apple-mobile-web-app-capable" content="yes">'
    '<meta name="apple-mobile-web-app-status-bar-style" content="default">'
    '<meta name="mobile-web-app-capable" content="yes">'
    '<meta name="theme-color" content="#FFF6FA">'
    '<link rel="icon" href="data:image/svg+xml,%3Csvg xmlns=%27http://www.w3.org/2000/svg%27 viewBox=%270 0 100 100%27%3E%3Ctext y=%27.9em%27 font-size=%2790%27%3E%F0%9F%A7%81%3C/text%3E%3C/svg%3E">'
    '<link rel="apple-touch-icon" href="icon.png">'
    '<style>:root{color-scheme:light;padding-top:env(safe-area-inset-top,0px);padding-bottom:env(safe-area-inset-bottom,0px)}'
    'body{margin:0;font-family:system-ui,sans-serif;font-size:14px}img{max-width:100%}[hidden]{display:none!important}</style>'
    '</head><body>'
)
TAIL = "</body></html>"


def main() -> None:
    html = SRC.read_text(encoding="utf-8")
    html = html.replace('<meta name="claude:viewport-fit-sides" content="cover">', "")
    if len(sys.argv) > 1 and sys.argv[1]:
        url = sys.argv[1].replace("'", "")
        html, n = re.subn(r"const REPORT_URL = '[^']*';", f"const REPORT_URL = '{url}';", html, count=1)
        if n != 1:
            raise SystemExit("REPORT_URL line not found in index.html")
    OUT.parent.mkdir(exist_ok=True)
    OUT.write_text(HEAD + html + TAIL, encoding="utf-8")
    print(f"wrote {OUT} ({OUT.stat().st_size:,} bytes)")


if __name__ == "__main__":
    main()

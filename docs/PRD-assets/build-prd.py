#!/usr/bin/env python3
"""PRD-buildlog.src.md의 그림 참조를 base64 PNG로 바꿔 docs/PRD-buildlog.md를 만든다.

사용법: docs/PRD-assets/ 안에서 `python3 build-prd.py`
사전 조건: 같은 폴더에 0N-*.png가 있어야 한다. (draw.io 데스크톱: `drawio -x -f png -s 2 -b 20 -o 0N.png 0N.drawio`)
"""
import base64
import pathlib
import re
import sys

here = pathlib.Path(__file__).resolve().parent
src = (here / "PRD-buildlog.src.md").read_text(encoding="utf-8")
out_path = here.parent / "PRD-buildlog.md"

def embed(match: re.Match) -> str:
    name = match.group(1)
    png = here / name
    if not png.exists():
        sys.exit(f"missing image: {png}")
    data = base64.b64encode(png.read_bytes()).decode("ascii")
    return f"](data:image/png;base64,{data})"

built, n = re.subn(r"\]\(([0-9]{2}-[a-z0-9-]+\.png)\)", embed, src)
out_path.write_text(built, encoding="utf-8")

relative_links = re.findall(r"\]\((?!data:|https?://)[^)]*\)", built)
size = out_path.stat().st_size
print(f"images embedded: {n}")
print(f"relative links left: {len(relative_links)} {relative_links[:5]}")
print(f"size: {size/1_000_000:.2f} MB (limit 16 MB) -> {out_path}")
assert n == 5 and not relative_links and size < 16_000_000

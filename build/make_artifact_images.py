"""Re-encode paintings small enough to be inlined in the single-file build.

An Artifact is one HTML file with a hard 16MB ceiling, and data: URIs count
toward it — base64 costs another third on top of the bytes. The served app ships
170 paintings at 1000px, which is 27MB; that cannot go in a single file at any
quality worth looking at.

So this writes a reduced set: the curated core plus the second tier, at 800px.
That is 117 of the 170 works and lands around 11MB encoded, leaving comfortable
room for the fonts, the data and the code. Dropping to a size that fits all 170
would soften the deep-zoom crop in Eye, which is the one place the resolution is
actually doing work.

Output: build/.cache/artifact-images.json  { qid: "data:image/webp;base64,..." }

Run:  python build/make_artifact_images.py [maxTier]
"""
import base64
import io
import json
import os
import sys

from PIL import Image

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
CACHE = os.path.join(ROOT, "build", ".cache")
os.makedirs(CACHE, exist_ok=True)

MAX_TIER = int(sys.argv[1]) if len(sys.argv) > 1 else 2
WIDTH = 800
QUALITY = 72

art = json.load(open(os.path.join(ROOT, "app", "data", "art.json"), encoding="utf-8"))
items = [i for i in art["items"] if i["tier"] <= MAX_TIER]

out = {}
raw = 0
for item in items:
    src = os.path.join(ROOT, "app", "img", item["img"])
    with Image.open(src) as im:
        im = im.convert("RGB")
        if im.width > WIDTH:
            im = im.resize((WIDTH, round(im.height * WIDTH / im.width)), Image.LANCZOS)
        buf = io.BytesIO()
        im.save(buf, "WEBP", quality=QUALITY, method=6)
    data = buf.getvalue()
    raw += len(data)
    out[item["id"]] = "data:image/webp;base64," + base64.b64encode(data).decode()
    sys.stdout.write(".")
    sys.stdout.flush()

path = os.path.join(CACHE, "artifact-images.json")
json.dump(out, open(path, "w", encoding="utf-8"), separators=(",", ":"))

print()
print(f"tiers          : 1..{MAX_TIER}")
print(f"paintings      : {len(out)} of {len(art['items'])}")
print(f"raw webp       : {raw / 1048576:.1f}MB at {WIDTH}px q{QUALITY}")
print(f"as data URIs   : {os.path.getsize(path) / 1048576:.1f}MB")

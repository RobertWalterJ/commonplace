"""Turn the downloaded Commons originals into what the app ships.

sources/img-cache/*  ->  app/img/<qid>.webp        (max 1000px, quality 82)
                     ->  app/data/lqip.json        (20px blur placeholders)

Two reasons this step exists rather than shipping the JPEGs as fetched:

  * size. 170 Commons JPEGs at 1400px are 177MB. The same images as WebP at
    1000px are a fraction of that, and this has to live on a phone.
  * the placeholder. A 20px version of each painting, inlined in the JSON as a
    data URI, means every question paints something immediately and the full
    image resolves into it. On a slow connection that is the difference between
    a game and a loading screen.

1000px is chosen for the zoom mode: Eye starts cropped into a detail at 3x, so
the pixels have to be there.

Run:  python build/encode_images.py
"""
import base64
import io
import json
import os
import sys

from PIL import Image, ImageFilter

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
CACHE = os.path.join(ROOT, "sources", "img-cache")
OUT = os.path.join(ROOT, "app", "img")
DATA = os.path.join(ROOT, "app", "data")

MAX_W = 1000
QUALITY = 82
LQIP_W = 20

os.makedirs(OUT, exist_ok=True)

art = json.load(open(os.path.join(DATA, "art.json"), encoding="utf-8"))
items = art["items"]

lqip = {}
total_in = total_out = 0
done = skipped = failed = 0
errors = []

for item in items:
    qid = item["id"]
    src = None
    for name in os.listdir(CACHE):
        if name.rsplit(".", 1)[0] == qid:
            src = os.path.join(CACHE, name)
            break
    if src is None:
        errors.append(f"{qid} {item['title']}: no cached download")
        failed += 1
        continue

    dest = os.path.join(OUT, f"{qid}.webp")
    total_in += os.path.getsize(src)

    try:
        with Image.open(src) as im:
            im = im.convert("RGB")
            if im.width > MAX_W:
                h = round(im.height * MAX_W / im.width)
                im = im.resize((MAX_W, h), Image.LANCZOS)
            im.save(dest, "WEBP", quality=QUALITY, method=6)

            # The placeholder is blurred before it is shrunk so that the
            # upscaled version in the browser reads as a soft wash of the
            # painting's colour rather than as visible pixel blocks.
            small = im.filter(ImageFilter.GaussianBlur(radius=max(1, im.width // 120)))
            lw = LQIP_W
            lh = max(1, round(small.height * lw / small.width))
            small = small.resize((lw, lh), Image.LANCZOS)
            buf = io.BytesIO()
            small.save(buf, "WEBP", quality=45, method=6)
            lqip[qid] = "data:image/webp;base64," + base64.b64encode(buf.getvalue()).decode()
    except Exception as exc:                      # noqa: BLE001 - report and continue
        errors.append(f"{qid} {item['title']}: {exc}")
        failed += 1
        continue

    total_out += os.path.getsize(dest)
    done += 1
    sys.stdout.write("." if done % 10 else str(done))
    sys.stdout.flush()

json.dump(lqip, open(os.path.join(DATA, "lqip.json"), "w", encoding="utf-8"),
          separators=(",", ":"))

# Drop files for works that are no longer shipped. Without this the app folder
# quietly accumulates images from every earlier version of the selection, and
# they all end up in the deploy.
wanted = {item["img"] for item in items}
removed = 0
for name in os.listdir(OUT):
    if name not in wanted:
        os.remove(os.path.join(OUT, name))
        removed += 1

print()
print(f"encoded        : {done}  (failed {failed}, skipped {skipped})")
print(f"source         : {total_in / 1048576:.1f}MB")
print(f"shipped webp   : {total_out / 1048576:.1f}MB"
      f"   ({total_out / max(done, 1) / 1024:.0f}KB average)")
print(f"pruned         : {removed} image(s) no longer shipped")
print(f"placeholders   : {os.path.getsize(os.path.join(DATA, 'lqip.json')) / 1024:.0f}KB for {len(lqip)}")
for e in errors:
    print("   !", e)

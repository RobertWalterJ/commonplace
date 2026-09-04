"""Draw the Commonplace app icons.

Drawn geometrically rather than typeset: the app's fonts are woff2, which
Pillow cannot read, and shipping a second copy of a typeface just to render one
letter would be silly. An arc with a gap reads as a C at 48px, which is the
size that actually matters on a home screen.

The maskable version keeps the mark inside the safe circle, because Android
crops maskable icons to whatever shape the launcher feels like.

Run:  python build/make_icons.py
"""
import os

from PIL import Image, ImageDraw

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
OUT = os.path.join(ROOT, "app", "icons")
os.makedirs(OUT, exist_ok=True)

PAPER = (251, 248, 243)
ACCENT = (176, 64, 44)
GOLD = (168, 132, 44)

SS = 4  # supersample, then downscale — Pillow's arc has no antialiasing


def mark(size, scale=1.0, bg=PAPER):
    """One icon: a red C, with a gold full stop in the gap."""
    s = size * SS
    im = Image.new("RGB", (s, s), bg)
    d = ImageDraw.Draw(im)

    r = s * 0.34 * scale
    cx = cy = s / 2
    width = int(s * 0.105 * scale)

    box = [cx - r, cy - r, cx + r, cy + r]
    # Gap on the right, the way a C opens.
    d.arc(box, start=38, end=322, fill=ACCENT, width=width)

    # Round the two terminals so the stroke does not end in a hard chop.
    for angle in (38, 322):
        import math
        a = math.radians(angle)
        tx, ty = cx + r * math.cos(a), cy + r * math.sin(a)
        d.ellipse([tx - width / 2, ty - width / 2, tx + width / 2, ty + width / 2], fill=ACCENT)

    dot = s * 0.045 * scale
    d.ellipse([cx + r - dot, cy - dot, cx + r + dot, cy + dot], fill=GOLD)

    return im.resize((size, size), Image.LANCZOS)


for size in (192, 512):
    mark(size).save(os.path.join(OUT, f"icon-{size}.png"))
    print(f"icon-{size}.png")

# Maskable: same mark, pulled in to survive an aggressive launcher crop.
mark(512, scale=0.68).save(os.path.join(OUT, "icon-maskable-512.png"))
print("icon-maskable-512.png")

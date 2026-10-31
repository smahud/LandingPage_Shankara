#!/usr/bin/env python3
"""LCP/perf image pass 2 (2026-10-31): AVIF hero, tiny logo WebP, re-encode heavy WebPs.

Targets (from Lighthouse mobile audit):
- hero-yoga  -> AVIF q62 (LCP element, preload + fetchpriority=high)
- logo-lotus -> 128px WebP (was 41KB PNG rendered at 26-30px!)
- garden-path-> re-encode q74 (audit: 38KB wasted)
- healthy-meal -> 1100px q72 (was 203KB)
"""
import os
import PIL
import pillow_avif  # noqa: F401  (registers AVIF codec)
from PIL import Image

BASE = "/home/z/my-project/public/images"
ORIG = "/home/z/my-project/upload/images"


def save_webp(im, path, q):
    im.save(path, "WEBP", quality=q, method=6)
    return os.path.getsize(path)


def save_avif(im, path, q, speed=7):
    im.save(path, "AVIF", quality=q, speed=speed)
    return os.path.getsize(path)


def kb(p):
    return f"{os.path.getsize(p)/1024:.1f}KB"


# 1) hero AVIF (keep 600x400 — no bigger source exists; CSS upscale as before)
hero = Image.open(f"{BASE}/hero-yoga.webp").convert("RGB")
sz = save_avif(hero, f"{BASE}/hero-yoga.avif", 62, speed=6)
print(f"hero-yoga.avif  {kb(f'{BASE}/hero-yoga.avif')} (was webp {kb(f'{BASE}/hero-yoga.webp')})")

# 2) logo: 256 PNG -> 128 WebP (navbar 26px, footer 30px, favicon; 128 = 4x headroom)
logo = Image.open(f"{ORIG}/Desain-tanpa-judul-2026-03-28T113028.920.png")
logo = logo.resize((128, 128), Image.LANCZOS)
sz = save_webp(logo, f"{BASE}/logo-lotus.webp", 92)
print(f"logo-lotus.webp {kb(f'{BASE}/logo-lotus.webp')} (was png {kb(f'{BASE}/logo-lotus.png')})")

# 3) garden-path re-encode (600x400 q74)
gp = Image.open(f"{BASE}/garden-path.webp").convert("RGB")
save_webp(gp, f"{BASE}/garden-path.webp", 74)
print(f"garden-path.webp {kb(f'{BASE}/garden-path.webp')} (was 73KB)")

# 4) healthy-meal: 1280x960 203KB -> 1100 wide q72
hm = Image.open(f"{BASE}/healthy-meal.webp").convert("RGB")
hm = hm.resize((1100, 825), Image.LANCZOS)
save_webp(hm, f"{BASE}/healthy-meal.webp", 72)
print(f"healthy-meal.webp {kb(f'{BASE}/healthy-meal.webp')} (was 203KB)")

print("\nAll images now:")
for f in sorted(os.listdir(BASE)):
    print(f" {f:26s} {kb(os.path.join(BASE, f))}")

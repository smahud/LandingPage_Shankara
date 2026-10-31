#!/usr/bin/env python3
"""Scan a (full-page) screenshot for near-white vertical strips touching the
right edge (or anywhere), and report their y-ranges so we can map them to page
sections. Also samples the colors along the last few pixel columns."""
import sys
from PIL import Image


def is_near_white(px, tol=18):
    r, g, b = px[:3]
    return abs(r - 255) <= tol and abs(g - 255) <= tol and abs(b - 255) <= tol


def scan(path):
    im = Image.open(path).convert("RGB")
    w, h = im.size
    print(f"image: {path}  {w}x{h}")

    # 1) columns that are near-white for a large fraction of their height
    frac_thresh = 0.25
    suspects = []
    for x in range(w - 1, max(w - 30, -1), -1):  # scan last 30 columns
        col = [im.getpixel((x, y)) for y in range(0, h, 8)]
        nw = sum(1 for p in col if is_near_white(p))
        frac = nw / len(col)
        if frac > frac_thresh:
            suspects.append((x, round(frac, 2)))
    print("near-white right-edge columns (>25% height):", suspects if suspects else "NONE")

    # 2) y-ranges of near-white pixels in the last column
    x = w - 1
    ys = [y for y in range(h) if is_near_white(im.getpixel((x, y)))]
    if not ys:
        print("last column has no near-white pixels")
        return
    ranges, start, prev = [], ys[0], ys[0]
    for y in ys[1:]:
        if y - prev > 6:
            ranges.append((start, prev))
            start = y
        prev = y
    ranges.append((start, prev))
    print(f"near-white y-ranges at x={x} (page height {h}):")
    tot = 0
    for a, b in ranges:
        print(f"  y={a}..{b}  ({b - a + 1}px)")
        tot += b - a + 1
    print(f"total near-white pixels on right edge: {tot}/{h} ({100 * tot / h:.1f}%)")

    # 3) sample the right edge color at a few key rows
    for frac in (0.05, 0.2, 0.4, 0.5, 0.6, 0.8, 0.95, 0.99):
        y = int(h * frac)
        print(f"  y={y} ({frac:.0%}): edge={im.getpixel((w - 1, y))}  x=w-4={im.getpixel((w - 4, y))}")


if __name__ == "__main__":
    scan(sys.argv[1])

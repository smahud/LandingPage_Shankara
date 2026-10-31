#!/usr/bin/env python3
"""Create public/favicon.ico from the lotus logo so browsers get a real icon
(the central proxy passes /favicon* straight to the app; without this file
the app would answer 404 for /favicon.ico)."""
from PIL import Image

src = Image.open("/home/z/my-project/public/images/logo-lotus.png").convert("RGBA")
if src.size[0] < 64:
    src = src.resize((64, 64), Image.LANCZOS)
out = "/home/z/my-project/public/favicon.ico"
src.save(out, format="ICO", sizes=[(16, 16), (32, 32), (48, 48), (64, 64)])
print("favicon written:", out)

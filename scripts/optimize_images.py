#!/usr/bin/env python3
"""Optimize Shankara images to fast-loading WebP + map friendly names."""
import os
from PIL import Image

SRC = '/home/z/my-project/upload/images'
DST = '/home/z/my-project/public/images'
os.makedirs(DST, exist_ok=True)

# friendly name mapping based on VLM analysis
mapping = {
    '2-1.png': 'hero-yoga',              # yoga in nature
    '2.png': 'pyramid-white',            # white pyramid glamping
    '3.png': 'pyramid-dark',             # dark pyramid tent
    'Desain-tanpa-judul-2026-03-28T113028.920.png': 'logo-lotus',       # golden lotus logo (alpha)
    'Desain-tanpa-judul-2026-04-11T093740.782.png': 'pavilion',         # thatched roof pavilion
    'Desain-tanpa-judul-2026-04-11T093812.085.png': 'foot-massage',     # foot massage therapy
    'Desain-tanpa-judul-2026-04-13T135949.469.png': 'tent-lounge',      # white canvas tent lounge
    'Desain-tanpa-judul-2026-04-13T140100.499.png': 'garden-path',      # brick garden pathway
    'Desain-tanpa-judul-2026-04-15T105258.295.png': 'meditation',       # person meditating on lawn
    'Desain-tanpa-judul-2026-04-21T094135.133.png': 'outdoor-session',  # group circle session
    'Desain-tanpa-judul-2026-05-20T141038.543.png': 'indoor-seminar',   # indoor seminar
    'Desain-tanpa-judul-2026-05-20T141024.701.png': 'workshop-audience',# workshop audience
    'Desain-tanpa-judul-2026-05-20T141342.541.png': 'yoga-studio',      # indoor yoga studio
    'WhatsApp-Image-2026-04-30-at-11.57.25.jpeg': 'healthy-meal',       # healthy meal
}

total_before = total_after = 0
for src_name, out_name in mapping.items():
    p = os.path.join(SRC, src_name)
    if not os.path.exists(p):
        print('MISSING', src_name); continue
    im = Image.open(p)
    if out_name == 'logo-lotus':
        im = im.resize((256, 256), Image.LANCZOS)
        out = os.path.join(DST, 'logo-lotus.png')
        im.save(out, optimize=True)
        sz = os.path.getsize(out)
        print(f'{out_name}: PNG-alpha {sz/1024:.0f} KB (was {os.path.getsize(p)/1024:.0f} KB)')
        total_before += os.path.getsize(p); total_after += sz
        continue
    if im.width > 1600:
        ratio = 1600 / im.width
        im = im.resize((1600, int(im.height * ratio)), Image.LANCZOS)
    out = os.path.join(DST, out_name + '.webp')
    im.convert('RGB').save(out, 'WEBP', quality=82, method=6)
    sz = os.path.getsize(out)
    print(f'{out_name}: {im.size} {sz/1024:.0f} KB (was {os.path.getsize(p)/1024:.0f} KB)')
    total_before += os.path.getsize(p); total_after += sz

print(f'\nTOTAL: {total_before/1024:.0f} KB -> {total_after/1024:.0f} KB  ({100*(1-total_after/total_before):.0f}% smaller)')

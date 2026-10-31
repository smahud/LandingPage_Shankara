#!/usr/bin/env python3
import re
from collections import Counter

raw = open('/home/z/my-project/upload/shankara_home.html', encoding='utf-8', errors='ignore').read()
print('len:', len(raw))

imgs = re.findall(r'<img[^>]+src="([^"]+)"', raw)
print('\nIMAGES (%d):' % len(imgs))
for i in imgs[:30]:
    print(' ', i)

colors = re.findall(r'background-color:\s*([#\w(),. ]+)', raw)
print('\nTOP BG COLORS:', Counter(colors).most_common(12))

colors2 = re.findall(r'color:\s*(#[0-9a-fA-F]{3,8}|rgb\([^)]+\))', raw)
print('\nTOP TEXT COLORS:', Counter(colors2).most_common(12))

fonts = re.findall(r'font-family:\s*([^;}"]+)', raw)
print('\nFONTS:', Counter(fonts).most_common(8))

print('\nGENERATOR:', re.findall(r'<meta name="generator" content="([^"]+)"', raw))

#!/usr/bin/env python3
"""Extract readable text content from downloaded Shankara HTML pages."""
import re
import html as html_mod
from pathlib import Path

def extract_text(html: str) -> str:
    # Remove scripts and styles
    html = re.sub(r'<script[^>]*>.*?</script>', ' ', html, flags=re.S | re.I)
    html = re.sub(r'<style[^>]*>.*?</style>', ' ', html, flags=re.S | re.I)
    html = re.sub(r'<!--.*?-->', ' ', html, flags=re.S)
    # Remove noscript
    html = re.sub(r'<noscript[^>]*>.*?</noscript>', ' ', html, flags=re.S | re.I)
    # Mark headings and structure
    html = re.sub(r'<h1[^>]*>', '\n\n# H1: ', html, flags=re.I)
    html = re.sub(r'<h2[^>]*>', '\n\n# H2: ', html, flags=re.I)
    html = re.sub(r'<h3[^>]*>', '\n\n# H3: ', html, flags=re.I)
    html = re.sub(r'<h4[^>]*>', '\n\n# H4: ', html, flags=re.I)
    html = re.sub(r'<h5[^>]*>', '\n\n# H5: ', html, flags=re.I)
    html = re.sub(r'<h6[^>]*>', '\n\n# H6: ', html, flags=re.I)
    html = re.sub(r'<li[^>]*>', '\n • ', html, flags=re.I)
    html = re.sub(r'<p[^>]*>', '\n\n', html, flags=re.I)
    html = re.sub(r'<br[^>]*>', '\n', html, flags=re.I)
    html = re.sub(r'<a [^>]*href="([^"]*)"[^>]*>', r' [LINK->\1] ', html, flags=re.I)
    # Remove all other tags
    html = re.sub(r'<[^>]+>', ' ', html)
    text = html_mod.unescape(html)
    # Clean whitespace
    text = re.sub(r'[ \t]+', ' ', text)
    text = re.sub(r'\n\s*\n\s*\n+', '\n\n', text)
    lines = [ln.strip() for ln in text.split('\n')]
    return '\n'.join(lines)

def extract_links(html: str):
    links = sorted(set(re.findall(r'href="(https?://[^"]+|/[^"]*)"', html)))
    return [l for l in links if not any(x in l for x in ('.css', '.js', '.png', '.jpg', '.svg', '.ico', 'xmlrpc', 'feed', '.webp', '.woff', 'fonts'))]

base = Path('/home/z/my-project/upload')
for name in ['shankara_home', 'shankara_about', 'shankara_services', 'shankara_contact']:
    p = base / f'{name}.html'
    if not p.exists():
        print(f'=== {name}: MISSING ===')
        continue
    raw = p.read_text(encoding='utf-8', errors='ignore')
    print(f'\n{"="*70}\n=== {name} ===\n{"="*70}')
    txt = extract_text(raw)
    # skip boilerplate head
    idx = txt.find('Skip to content')
    if idx > 200:
        txt = txt[idx:]
    print(txt[:7000])
    print(f'\n--- LINKS ({name}) ---')
    for l in extract_links(raw)[:40]:
        print(l)

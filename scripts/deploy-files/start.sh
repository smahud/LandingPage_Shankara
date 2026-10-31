#!/bin/bash
# Shankara Wellness & Sanctuary — unit shankarawell
# Direktori : /var/www/shankarawell
# App       : 127.0.0.1:4080 (HANYA proxy pusat yang boleh akses)
# Publik    : :3980 via proxy pusat — https://shankarawell.yapsidarussalam.or.id
#             (cloudflared tunnel -> https://shankarawell.yapsidarussalam.or.id:3980)
# Skema     : port NON-yapsi di 397X/398X publik, internal = digit-match 40X
#             (398X -> 408X ; 397X -> 407X). Dokumen acuan: /root/PORT_MAPPING.md
cd /var/www/shankarawell/standalone || exit 1
exec env PORT=4080 HOSTNAME=127.0.0.1 node server.js >> next.log 2>&1

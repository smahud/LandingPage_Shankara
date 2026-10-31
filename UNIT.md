# Shankara Wellness & Sanctuary — unit `shankarawell`

- Direktori : `/var/www/shankarawell`
- App       : Next.js standalone di `127.0.0.1:4080` (hanya proxy pusat)
- Publik    : https://shankarawell.yapsidarussalam.or.id → cloudflared (tunnel
  `b2662399-f69d-41f9-8373-e591d7fb860e`) →
  `https://shankarawell.yapsidarussalam.or.id:3980`
  (proxy pusat, sertifikat LE wildcard `*.yapsidarussalam.or.id`)
- Service   : `shankarawell.service` (systemd, Restart=on-failure)
- Skema     : NON-yapsi → publik 398X / internal 408X (digit-match).
  Lihat **/root/PORT_MAPPING.md** (dokumen acuan semua port).
- Sejarah   : 2026-10-31 deploy awal sebagai `shankarawe` (:3998/:4008,
  `/var/www/shankarawe`), migrasi hari yang sama ke :3980/:4080 sesuai skema
  port baru owner (399X khusus yapsi). Build dari repo chat Z.ai `3e026c4e`.

## Performa (optimasi 2026-10-31, target GTmetrix A)

- `next.config.ts`: `images.unoptimized: true` — semua gambar diserve langsung
  dari `/images/*.webp` (pre-optimized via PIL, total ~0.9MB/14 file), BUKAN via
  `/_next/image`. Alasan: URL optimizer tidak pernah di-cache di edge Cloudflare
  (`cf-cache-status: DYNAMIC`) → setiap request gambar bolak-balik ke origin
  (LCP 3.6s dari US). Static `.webp` + `Cache-Control: max-age=2592000`
  (header via `next.config.headers()`) → `cf-cache-status: HIT` di semua PoP.
- Halaman `/` = SSG (prerendered static HTML) — jangan tambahkan API dinamis
  di RootLayout/page agar tetap static.
- Jika menambah gambar baru: optimasi manual ke WebP sebelum upload
  (pola `scripts/optimize_images.py`), letakkan di `public/images/`.

## HTTPS-only (No HTTP)

- Proxy pusat hanya membuka listener **HTTPS** di :3980 (tidak ada http).
- App hanya mendengar di `127.0.0.1:4080` — tidak diekspos keluar.
- Middleware app (`src/middleware.ts`): permintaan dengan tepi Cloudflare
  `cf-visitor: {"scheme":"http"}` di-redirect permanen (308) ke `https://`
  (loop-proof; target redirect dibangun dari header host).
- Proxy pusat menambah header HSTS pada semua respons.
- Verifikasi: `curl http://shankarawell.yapsidarussalam.or.id:3980/` → GAGAL (000);
  `curl https://shankarawell.yapsidarussalam.or.id/` → 200.

## Runbook upgrade (nol downtime unit lain)

1. Build standalone di repo, siapkan tarball.
2. `mv /var/www/shankarawell/standalone /var/www/shankarawell/standalone.prev`
3. `mkdir /var/www/shankarawell/standalone` lalu ekstrak tarball baru ke sana.
4. `systemctl restart shankarawell` — proxy & unit lain tidak disentuh.

## Rollback

```
cd /var/www/shankarawell
mv standalone standalone.bad
mv standalone.prev standalone
systemctl restart shankarawell
```

## Rollback penuh ke konfigurasi lama (jika migrasi port bermasalah)

```
# 1. restore proxy: kembalikan baris UNITS dari backup
ls /var/www/yapsi-landing/https-proxy.js.bak-*
cp /var/www/yapsi-landing/https-proxy.js.bak-<ts> /var/www/yapsi-landing/https-proxy.js
# 2. kembalikan app ke 4008 + dir lama
mv /var/www/shankarawell /var/www/shankarawe
# start.sh & unit lama: lihat sejarah di git repo chat (PORT=4008, :3998)
systemctl daemon-reload && systemctl restart yapsi-main
# 3. arahkan ulang Cloudflare ZeroTrust ke :3998
```

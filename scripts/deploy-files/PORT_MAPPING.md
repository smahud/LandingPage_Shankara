# 📌 PORT MAPPING — VPS YAPSI Darussalam

> **Dokumen acuan tunggal alokasi port di VPS ini. WAJIB dibaca sebelum deploy
> project baru APA PUN.** Jika anda agent/AI yang akan deploy di VPS ini,
> ikuti skema di bawah — jangan pilih port sendiri.
>
> Dibuat: **2026-10-31** (saat migrasi shankarawell :3998 → **:3980**).
> Pemilik skema: owner VPS. Update dokumen ini SETIAP KALI menambah/mengubah port.

---

## 1. AKSES VPS

| Item | Nilai |
|---|---|
| SSH | `ssh root@host.zerotier.my.id -p 2226` (sshd asli :22, 2226 = forward publik) |
| Kunci deploy AI | ed25519 `zai-sandbox-shankara-deploy`, fingerprint `SHA256:NqUVpuHhucxRYRmm5LoFLGNANclf6+CdFmL8VrUB6Po` |
| OS | Debian 12 (bookworm), Node v20.20.2, systemd |
| Semua layanan web | systemd unit — `systemctl restart <unit>`, log: `journalctl -u <unit>` |
| Tooling owner | `/root/deploy-v11.sh`, `/root/build-v11.sh`, `/root/audit-perunit.sh`, `/root/certbot_cloudflare.sh` |

---

## 2. ARSITEKTUR SINGKAT

```
Pengunjung → Cloudflare (ZeroTrust tunnel) → cloudflared (di VPS)
           → PROXY PUSAT HTTPS (/var/www/yapsi-landing/https-proxy.js,
             unit systemd `yapsi-main`) di port publik 39XX
           → app Next.js standalone di 127.0.0.1:40XX (loopback only)
```

- **Proxy pusat** = satu-satunya pemegang port publik 39XX + sertifikat TLS
  (Let's Encrypt **wildcard `*.yapsidarussalam.or.id`**, path
  `/etc/letsencrypt/live/yapsidarussalam.or.id/`, auto-renew `certbot.timer`,
  kedaluwarsa Jan 2027). Pengecualian: `sirat` punya HTTPS sendiri di :3901.
- **App TIDAK BOLEH** bind port publik — selalu `127.0.0.1` (HOSTNAME=127.0.0.1).
- **HTTPS-ONLY**: proxy hanya membuka listener TLS (tidak ada http), header HSTS
  otomatis di semua respons. App Next.js shankarawell menambah middleware 308
  `cf-visitor http → https`.
- **/etc/hosts**: setiap subdomain yang dipublikasikan lewat tunnel WAJIB punya
  baris `127.0.0.1 <subdomain>` (dipakai cloudflared untuk origin https).
  Cek: `grep yapsidarussalam /etc/hosts`.
- **Tunnel dikelola REMOTE** di dashboard Cloudflare (service jalan pakai `--token`).
  Menambah/mapping subdomain baru = ubah Public Hostname di dashboard ZeroTrust,
  BUKAN di file lokal VPS.

---

## 3. SKEMA PORT (KEPUTUSAN OWNER, 2026-10-31)

| Rentang publik | Peruntukan | Pasangan internal (digit-match) |
|---|---|---|
| **399X** (3990-3999) | **KHUSUS project YAPSI** | 399X → **400X** (contoh: 3991→4001) |
| **398X** (3980-3989) | Project NON-yapsi / lain | 398X → **408X** (contoh: 3980→4080) |
| **397X** (3970-3979) | Project NON-yapsi / lain | 397X → **407X** (contoh: 3975→4075) |
| 3900-3969 | Legacy/lain-lain | — (contoh: sirat :3901) |

Aturan **digit-match**: dua digit terakhir publik = dua digit terakhir internal.
Unit yapsi kelak (mis. 3998) → internal 4008. Project umum di 3985 → internal 4085.

---

## 4. PETA PORT SAAT INI (2026-10-31)

### Port publik (0.0.0.0)

| Port | Project | → Internal | Direktori | systemd | Domain publik |
|---|---|---|---|---|---|
| 3901 | SIRAT (arsip surat) | 3900 (own HTTPS, non-proxy) | `/var/www/sirat` | `sirat` | sirat.yapsidarussalam.or.id |
| **3980** | **Shankara Wellness** ⭐ | **4080** | `/var/www/shankarawell` | `shankarawell` | **shankarawell.yapsidarussalam.or.id** |
| 3990 | YAPSI landing main | 3999 | `/var/www/yapsi-landing` | `yapsi-main` | www.yapsidarussalam.or.id |
| 3991 | Panti Asuhan | 4001 | `/var/www/yapsi-panti` | `yapsi-panti` | panti.yapsidarussalam.or.id |
| 3992 | PAUD KB & RA | 4002 | `/var/www/yapsi-kb-ra` | `yapsi-kb-ra` | kb-ra.yapsidarussalam.or.id |
| 3993 | MI Darussalam | 4003 | `/var/www/yapsi-mi` | `yapsi-mi` | mi.yapsidarussalam.or.id |
| 3994 | MTs Darussalam | 4004 | `/var/www/yapsi-mts` | `yapsi-mts` | mts.yapsidarussalam.or.id |
| 3995 | Masjid Nasrullah | 4005 | `/var/www/yapsi-masjid` | `yapsi-masjid` | masjid.… *(belum dipublish tunnel)* |
| 3996 | Pondok Pesantren | 4006 | `/var/www/yapsi-ponpes` | `yapsi-ponpes` | ponpes.yapsidarussalam.or.id |
| 3997 | Rumah Tahfiz | 4007 | `/var/www/yapsi-tahfiz` | `yapsi-tahfiz` | tahfiz.yapsidarussalam.or.id |
| 3999 | (app yapsi-main — binding 0.0.0.0, deviasi historikal, akses via :3990) | — | `/var/www/yapsi-landing` | `yapsi-main` | — |

### Port internal loopback (127.0.0.1) — jangan dipakai utk publik

`3900` sirat-app · `4001` panti · `4002` kb-ra · `4003` mi · `4004` mts ·
`4005` masjid · `4006` ponpes · `4007` tahfiz · **`4080` shankarawell**

### Port BEBAS (bisa dipakai project baru)

| Range | Bebas |
|---|---|
| 399X (yapsi) | **3998** (dibebaskan 2026-10-31 dari shankarawe) → pasangan internal **4008** |
| 398X (umum) | 3981-3989 (internal 4081-4089) |
| 397X (umum) | 3970-3979 (internal 4070-4079) |
| Legacy 39XX | 3902-3969 (hindari kecuali owner minta) |

### Port di LUAR skema 39XX (jangan disentuh)

`22` sshd · `80/443` web stack lama (Apache/siakad/nextcloud) · `5432` PostgreSQL ·
`27017` MongoDB · `7080` dashboard (tunnel: dashboard.yapsidarussalam.or.id) ·
`20241/20242` layanan lokal · `33445` lain-lain.

---

## 5. CLOUDFLARE TUNNELS (remote-managed via dashboard)

| Service systemd | Tunnel ID | Akun CF | Isi |
|---|---|---|---|
| `cloudflared` (Akun A) | `b2662399-f69d-41f9-8373-e591d7fb860e` | e347da6f… | Semua yapsi + shankarawell + siakad/cloud/geofeed/finance/rdm |
| `cloudflared2nd` (Akun B) | `b830328f-28e1-422c-b1b3-6e71bdf98b61` | ac2cb2cd… | cryptonice.online, healthandbeauty.my.id, glimpseit.online |

Mapping tunnel A (versi config 66, 2026-10-31):

```
www        → https://www.yapsidarussalam.or.id:3990
sirat      → https://sirat.yapsidarussalam.or.id:3901
panti      → https://panti.yapsidarussalam.or.id:3991
kb-ra      → https://kb-ra.yapsidarussalam.or.id:3992
mi         → https://mi.yapsidarussalam.or.id:3993
mts        → https://mts.yapsidarussalam.or.id:3994
ponpes     → https://ponpes.yapsidarussalam.or.id:3996
tahfiz     → https://tahfiz.yapsidarussalam.or.id:3997
shankarawell → https://shankarawell.yapsidarussalam.or.id:3980   ⭐
dashboard  → https://dashboard.yapsidarussalam.or.id:7080
siakad     → http://siakad.yapsidarussalam.or.id   (satu-satunya http)
siakad2025/geofeed/database/cloud/finance/rdm_* → https://…:443
```

> Cek config tunnel terkini: `journalctl -u cloudflared --no-pager | grep 'Updated to new configuration' | tail -1`

---

## 6. RUNBOOK — DEPLOY PROJECT BARU (NON-YAPSI) ⭐

Contoh: project baru `foo` di `foo.yapsidarussalam.or.id`.

1. **Pilih port** dari 397X/398X yang bebas (tabel §4) → catat pasangan internal
   (digit-match 40X). Contoh: publik `3981` → internal `4081`.
2. **Siapkan direktori** `/var/www/foo` berisi:
   - `standalone/` — hasil build Next.js `output: 'standalone'` (tar ekstrak di sini)
   - `standalone.prev/` — build sebelumnya (rollback)
   - `start.sh`:
     ```bash
     #!/bin/bash
     cd /var/www/foo/standalone || exit 1
     exec env PORT=4081 HOSTNAME=127.0.0.1 node server.js >> next.log 2>&1
     ```
   - `UNIT.md` — dokumentasi unit (pola: `/var/www/shankarawell/UNIT.md`)
3. **Systemd** `/etc/systemd/system/foo.service`:
   ```ini
   [Unit]
   Description=Foo (app internal :4081, publik :3981)
   After=network.target
   [Service]
   Type=simple
   User=root
   WorkingDirectory=/var/www/foo
   ExecStart=/var/www/foo/start.sh
   Restart=on-failure
   RestartSec=3
   [Install]
   WantedBy=multi-user.target
   ```
   Lalu: `systemctl daemon-reload && systemctl enable --now foo`
   Pastikan app bind LOOPBACK: `ss -tlnH | grep 4081` → harus `127.0.0.1:4081`.
4. **/etc/hosts**: `echo '127.0.0.1 foo.yapsidarussalam.or.id' >> /etc/hosts`
5. **Proxy pusat** `/var/www/yapsi-landing/https-proxy.js`:
   - BACKUP dulu: `cp https-proxy.js https-proxy.js.bak-$(date +%s)`
   - Tambah baris di object `UNITS` (urut nomor):
     `3981: { site: "foo", app: 4081 },`
   - Validasi: `node --check https-proxy.js` (GAGAL → restore backup!)
   - Reload: `systemctl restart yapsi-main` (~2 detik downtime SEMUA port —
     lakukan sekali, semua unit terdampak sama).
6. **Cloudflare dashboard** (ZeroTrust → Tunnels → Akun A → Public Hostname):
   - Subdomain `foo.yapsidarussalam.or.id` → service
     `https://foo.yapsidarussalam.or.id:3981`
   - (Ini TIDAK bisa diedit dari VPS — config tunnel remote-managed.)
7. **Verifikasi wajib** (semua harus lolos):
   ```bash
   curl -s -o /dev/null -w '%{http_code}' https://foo.yapsidarussalam.or.id:3981/   # 200
   curl -s -o /dev/null -w '%{http_code}' http://foo.yapsidarussalam.or.id:3981/    # harus GAGAL (000)
   systemctl is-active foo yapsi-main                                                # active active
   ```
8. **UPDATE DOKUMEN INI** (§4 tabel + port bebas) setelah selesai.

Untuk **unit YAPSI baru**: sama persis, tapi port dari 399X (bebas: 3998),
internal 400X, direktori `/var/www/yapsi-<unit>`, plus header `x-yapsi-site`
otomatis di-set proxy (lihat komentar file proxy: pola infra-perunit v11).

---

## 7. RUNBOOK — UPGRADE / ROLLBACK APP (nol downtime unit lain)

```bash
# UPGRADE build saja (proxy & unit lain tidak disentuh):
cd /var/www/foo
mv standalone standalone.prev && mkdir standalone
tar -xzf build-baru.tar.gz -C standalone
systemctl restart foo

# ROLLBACK:
mv standalone standalone.bad && mv standalone.prev standalone && systemctl restart foo
```

Menambah/mengubah PORT = edit `UNITS` di proxy pusat + `systemctl restart yapsi-main`
(downtime ~2s semua port). Jangan lupa update dokumen ini.

---

## 8. ATURAN HTTPS-ONLY (BERLAKU BAGI SEMUA PROJECT BARU)

1. App bind `127.0.0.1` saja (`HOSTNAME=127.0.0.1`) — tidak diekspos langsung.
2. Publik hanya lewat proxy pusat TLS (tidak ada listener http di port publik).
3. Jangan buat listener http di port 39XX. `http://<sub>:<port>` harus GAGAL.
4. Middleware Next.js (pola shankarawell): redirect 308 jika header Cloudflare
   `cf-visitor: {"scheme":"http"}` → `https://` (loop-proof, lihat
   `/var/www/shankarawell/standalone/…/middleware` atau repo build).
5. Proxy pusat menambah HSTS `max-age=15552000` otomatis di semua respons.

---

## 9. CHEATSHEET

```bash
ss -tlnH | grep -E ':(39[0-9][0-9])\s'        # port 39XX yang terpakai
ss -tlnH | grep -E ':(40[0-9][0-9])\s'        # port internal 40XX
systemctl list-units | grep -Ei 'yapsi|shankara|sirat|cloudflared'
curl -sk -o /dev/null -w '%{http_code}\n' https://127.0.0.1:<publik>/   # tes proxy lokal
journalctl -u <unit> -n 30 --no-pager         # log service
tail -30 /var/www/<project>/standalone/next.log  # log app
journalctl -u cloudflared --no-pager | grep 'Updated to new configuration' | tail -1  # config tunnel
```

---

## 10. CATATAN / KEJADIAN PENTING

- **2026-10-31** — Migrasi `shankarawe` → **`shankarawell`**: publik :3998 → **:3980**,
  internal :4008 → **:4080**, direktori `/var/www/shankarawe` → **`/var/www/shankarawell`**
  (alasan: skema baru 399X khusus yapsi, 397X-398X project lain). Port 3998 & 4008
  dibebaskan utk unit yapsi berikutnya. Service `shankarawe.service` dihapus,
  diganti `shankarawell.service`.
- **2026-10-31** — Perbaikan pre-existing: `/etc/hosts` kurang entry
  `ponpes.yapsidarussalam.or.id` (yang ada cuma `pondok.…`) → origin tunnel gagal;
  sudah ditambah (kini ponpes publik 200). Entry `masjid…` juga ditambah,
  tetapi hostname **masjid belum dipublish di tunnel** (perlu ditambah owner
  di dashboard Cloudflare bila ingin aktif).
- Deviasi yang disengaja/sudah ada: app `yapsi-main` bind `0.0.0.0:3999`;
  `sirat` tidak lewat proxy pusat (HTTPS sendiri di :3901); `siakad` tunnel
  masih `http://` (port 80) — satu-satunya non-TLS.
- Unit legacy tidak berjalan: `yapsi.service`, `cloudflared-update.service` (manual).
- Repo build shankarawell: chat Z.ai `3e026c4e`; kunci deploy AI: ed25519
  `zai-sandbox-shankara-deploy` (publik: `ssh-ed25519 AAAAC3NzaC1lZDI1NTE5AAAAIFNEOFmxMWcWaL0yTGwQ/aia+irUnV4GE78WakENXYoY`).

#!/bin/bash
# finish_push.sh — finalisasi riwayat git + push ke GitHub (idempoten).
# Token: dibaca dari /tmp/.gh_pat (atau env GITHUB_TOKEN), LANGSUNG dihapus
# setelah dibaca; tidak pernah ditulis ke repo / .git/config / log.
cd /home/z/my-project || { echo "FATAL: project dir hilang"; exit 1; }

# 0) Ambil token lalu hancurkan file-nya segera
if [ -z "$GITHUB_TOKEN" ]; then
  [ -f /tmp/.gh_pat ] || { echo "FATAL: /tmp/.gh_pat tidak ada"; exit 1; }
  export GITHUB_TOKEN="$(cat /tmp/.gh_pat)"
  shred -u /tmp/.gh_pat 2>/dev/null || rm -f /tmp/.gh_pat
  echo "[cred ] token dibaca dari file temp — file dihapus"
fi

# 1) Pastikan 4 commit bersih ada (drop UUID checkpoint bila menimpa)
SITE=$(git log --format='%H %s' | grep 'feat: bilingual' | head -1 | cut -d' ' -f1)
DOCS=$(git log --format='%H %s' | grep ' docs: README' | head -1 | cut -d' ' -f1)
if [ -z "$DOCS" ]; then
  if [ -n "$SITE" ]; then
    git reset -q "$SITE"
  else
    echo "FATAL: commit site tidak ditemukan — perlu rebuild manual"; exit 1
  fi
  git add scripts
  git commit -q -m "feat(ops): VPS deployment scripts, systemd unit & port-mapping docs" \
    -m "Deploy ke /var/www/shankarawell via paramiko/SFTP.
App standalone di 127.0.0.1:4080, publik HTTPS :3980 lewat cloudflared
ZeroTrust + proxy pusat. Skema port: 399x khusus yapsi, 397x-398x project
lain, internal digit-match 40xx. Termasuk util gambar (PIL ke WebP/AVIF),
QA responsif 12 viewport, diagnostik LCP/TTFB, verifikasi PAT, dan
push_github.py (kredensial hanya via env/VPS, tidak pernah disimpan)."
  git add README.md
  git commit -q -m "docs: README dengan panduan dev, build, deploy VPS & push" \
    -m "Banner hero, fitur, stack, struktur direktori, arsitektur deployment
(:3980 publik / :4080 loopback), tabel scripts, dan catatan keamanan."
  echo "[git  ] commit ops+docs dibuat"
else
  echo "[git  ] commit ops+docs sudah ada — skip"
fi

echo "=== GIT LOG ==="; git log --oneline
echo "=== GIT STATUS (kosong = bersih) ==="; git status --short
echo "=== SECRET CHECK (harus kosong) ==="
git ls-files | grep -E '^\.env$|^\.ssh|^db/' || echo "OK: tidak ada secret ter-track"

# 2) Push ke GitHub akun smahud (repo dibuat private bila belum ada)
echo "=== PUSH ==="
python3 scripts/push_github.py --user smahud --repo shankarawell
RC=$?
echo "=== EXIT CODE: $RC ==="
exit $RC

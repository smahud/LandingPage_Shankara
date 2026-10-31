#!/usr/bin/env python3
"""push_github.py — commit-checkpoint & push repo shankarawell ke GitHub.

Alur:
  1. Ambil kredensial GitHub (PAT akun smahud) real-time dari VPS
     host.zerotier.my.id:2226 → /root/credential/github.pat.json
     (token TIDAK pernah di-print / disimpan di repo / dimasukkan ke
     .git/config — hanya hidup di env proses git via GIT_ASKPASS).
  2. Verifikasi token (GET /user) → pastikan akun & scope cukup.
  3. Pastikan repo ada (buat PRIVATE bila belum) via API.
  4. Set remote origin dengan URL bersih (tanpa token).
  5. git push -u origin main, lalu verifikasi SHA remote == lokal.

Pemakaian:
  python3 scripts/push_github.py [--repo shankarawell] [--public]

Idempotent — aman dijalankan ulang untuk sync.
"""
import argparse
import base64
import json
import os
import stat
import subprocess
import sys
import tempfile
import urllib.error
import urllib.request
from pathlib import Path

import paramiko

ROOT = Path(__file__).resolve().parents[1]
VPS_HOST, VPS_PORT, VPS_USER = "host.zerotier.my.id", 2226, "root"
KEY_PATH = ROOT / ".ssh" / "id_ed25519"
VPS_CRED = "/root/credential/github.pat.json"
API = "https://api.github.com"
UA = "shankarawell-push-script/1.0"
DEFAULT_DESC = ("Shankara Well — website bilingual (ID/EN). Next.js 16 standalone, "
                "Tailwind CSS 4, pre-optimized WebP/AVIF, HTTPS-only via Cloudflare tunnel.")


# ── Kredensial ────────────────────────────────────────────────────────
def fetch_credential(want_user: str = "smahud") -> dict:
    """Baca JSON kredensial dari VPS via SFTP. Hanya struktur yang di-print.

    Format file: {"<akun-github>": "<PAT>", ...} — dipilih akun `want_user`.
    """
    key = paramiko.Ed25519Key.from_private_key_file(str(KEY_PATH))
    cli = paramiko.SSHClient()
    cli.set_missing_host_key_policy(paramiko.AutoAddPolicy())
    cli.connect(VPS_HOST, port=VPS_PORT, username=VPS_USER, pkey=key, timeout=30)
    try:
        sftp = cli.open_sftp()
        with sftp.open(VPS_CRED) as f:
            data = json.loads(f.read().decode("utf-8"))
    finally:
        cli.close()

    token, user = pick_fields(data, want_user)
    if not token:
        sys.exit(f"GAGAL: token untuk akun {want_user!r} tidak ditemukan di {VPS_CRED}. "
                 f"Akun tersedia: {', '.join(k for k in data if isinstance(k, str))}")
    kind = "fine-grained PAT" if token.startswith("github_pat_") else (
        "classic PAT" if token.startswith("ghp_") else "token (tipe tidak dikenal)")
    print(f"[cred] {VPS_CRED} OK — akun: {user} | token: {kind}, {len(token)} char "
          "(nilai TIDAK ditampilkan)")
    return {"token": token, "user": user}


def pick_fields(data, want_user):
    """Ekstrak (token, akun). Format utama: {akun: PAT}; fallback: nested key
    bertipe token/pat/password. Prioritas akun `want_user`."""
    if isinstance(data, dict):
        # format {akun: token}
        plain = all(isinstance(v, str) for v in data.values()) and len(data) >= 1
        if plain and all(len(v) >= 20 for v in data.values()):
            for k in (want_user, (want_user or "").lower()):
                if k in data:
                    return data[k], k
            k = next(iter(data))
            return data[k], k

        # fallback: scan rekursif key token-ish
        found = []

        def walk(node, path):
            if isinstance(node, dict):
                for k, v in node.items():
                    if isinstance(v, str) and (
                            "token" in k.lower() or k.lower() in ("pat", "password", "secret")):
                        found.append((path, k, v))
                    elif isinstance(v, (dict, list)):
                        walk(v, f"{path}.{k}")
            elif isinstance(node, list):
                for i, v in enumerate(node):
                    walk(v, f"{path}[{i}]")

        walk(data, "$")
        if found:
            pref = [t for t in found if want_user and want_user.lower() in t[0].lower()]
            chosen = (pref or found)[0]
            return chosen[2], want_user
    return None, None


# ── GitHub API ────────────────────────────────────────────────────────
def api(token, method, path, body=None):
    req = urllib.request.Request(
        API + path,
        data=json.dumps(body).encode() if body is not None else None,
        method=method,
        headers={
            "Authorization": f"Bearer {token}",
            "Accept": "application/vnd.github+json",
            "User-Agent": UA,
            "X-GitHub-Api-Version": "2022-11-28",
        })
    try:
        with urllib.request.urlopen(req, timeout=30) as r:
            payload = r.headers.get("X-OAuth-Scopes")
            return r.status, json.loads(r.read().decode() or "{}"), payload
    except urllib.error.HTTPError as e:
        try:
            return e.code, json.loads(e.read().decode() or "{}"), e.headers.get("X-OAuth-Scopes")
        except Exception:
            return e.code, {}, None


def whoami(token):
    status, body, scopes = api(token, "GET", "/user")
    if status != 200:
        sys.exit(f"GAGAL: token tidak valid untuk API GitHub (HTTP {status}: "
                 f"{body.get('message', '?')}). Cek /root/credential/github.pat.json di VPS.")
    print(f"[auth] Token valid — login: {body['login']}"
          f"{f' | scopes: {scopes}' if scopes else ' | fine-grained PAT'}")
    return body["login"]


def ensure_repo(token, owner, repo, public):
    status, body, _ = api(token, "GET", f"/repos/{owner}/{repo}")
    if status == 200:
        vis = "private" if body.get("private") else "public"
        print(f"[repo ] {owner}/{repo} sudah ada ({vis}) — {body['html_url']}")
        return body["html_url"]
    if status != 404:
        sys.exit(f"GAGAL: cek repo HTTP {status}: {body.get('message')}")

    status, body, _ = api(token, "POST", "/user/repos", {
        "name": repo,
        "description": DEFAULT_DESC,
        "private": not public,
        "has_wiki": False,
        "has_projects": False,
        "auto_init": False,
    })
    if status not in (200, 201):
        sys.exit(f"GAGAL: buat repo HTTP {status}: {body.get('message')}. "
                 "Kemungkinan PAT tidak punya ijin pembuatan repo.")
    vis = "private" if body.get("private") else "public"
    print(f"[repo ] {owner}/{repo} DIBUAT ({vis}) — {body['html_url']}")
    return body["html_url"]


# ── Git push (token hanya via env, tidak di argv/config) ─────────────
def push(owner, repo, token, user):
    url = f"https://github.com/{owner}/{repo}.git"
    run = subprocess.run(["git", "remote", "get-url", "origin"],
                         capture_output=True, text=True, cwd=ROOT)
    if run.returncode == 0:
        subprocess.run(["git", "remote", "set-url", "origin", url], check=True, cwd=ROOT)
        print("[git  ] remote origin di-set-ulang (URL bersih tanpa token)")
    else:
        subprocess.run(["git", "remote", "add", "origin", url], check=True, cwd=ROOT)
        print("[git  ] remote origin ditambahkan")

    head = subprocess.run(["git", "rev-parse", "HEAD"],
                          capture_output=True, text=True, cwd=ROOT).stdout.strip()
    print(f"[git  ] HEAD lokal : {head[:10]}")

    askpass = Path(tempfile.mkdtemp(prefix="ghap-")) / "ap.sh"
    askpass.write_text('#!/bin/sh\ncase "$1" in\n  *sername*) printf \'%s\\n\' "$GH_USER" ;;\n'
                       '  *) printf \'%s\\n\' "$GH_TOKEN" ;;\nesac\n')
    askpass.chmod(0o700)
    env = dict(os.environ,
               GIT_ASKPASS=str(askpass),
               GIT_TERMINAL_PROMPT="0",
               GH_TOKEN=token,
               GH_USER=user or owner)
    try:
        run = subprocess.run(["git", "push", "-u", "origin", "main"],
                             cwd=ROOT, env=env, capture_output=True, text=True)
        out = (run.stdout + run.stderr).strip()
        # bersihkan kemungkinan leak token di output (pengaman ekstra)
        out = out.replace(token, "[REDACTED]")
        print(f"[push ] {out[-500:]}")
        if run.returncode != 0:
            sys.exit(f"GAGAL: git push exit {run.returncode}")
    finally:
        askpass.unlink()
        askpass.parent.rmdir()
    return head


def verify(token, owner, repo, head):
    import time
    for attempt in range(5):
        status, body, _ = api(token, "GET", f"/repos/{owner}/{repo}/commits/main")
        if status == 200 and body.get("sha") == head:
            print(f"[verif] SHA remote == lokal ({head[:10]}) — PUSH BERHASIL ✔")
            return
        time.sleep(2)
    sys.exit("GAGAL: SHA remote belum sama dengan lokal — cek manual di GitHub.")


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("--repo", default="shankarawell")
    ap.add_argument("--user", default="smahud",
                    help="akun GitHub yang tokennya dipakai (default: smahud)")
    ap.add_argument("--public", action="store_true",
                    help="buat repo public (default: private)")
    args = ap.parse_args()

    if not (ROOT / ".git").exists():
        sys.exit("GAGAL: bukan repo git — jalankan dari root project.")

    env_tok = os.environ.get("GITHUB_TOKEN", "").strip()
    if env_tok:
        kind = "fine-grained PAT" if env_tok.startswith("github_pat_") else "PAT"
        print(f"[cred] memakai GITHUB_TOKEN dari environment — {kind}, "
              f"{len(env_tok)} char (nilai TIDAK ditampilkan)")
        cred = {"token": env_tok, "user": args.user}
    else:
        cred = fetch_credential(args.user)
    owner = whoami(cred["token"])
    if owner.lower() != args.user.lower():
        sys.exit(f"GAGAL: token milik akun {owner}, bukan {args.user}.")
    ensure_repo(cred["token"], owner, args.repo, args.public)
    head = push(owner, args.repo, cred["token"], cred["user"])
    verify(cred["token"], owner, args.repo, head)
    print(f"\nSELESAI: https://github.com/{owner}/{args.repo} (branch main)")


if __name__ == "__main__":
    main()

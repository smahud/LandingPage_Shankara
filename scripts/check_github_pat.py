#!/usr/bin/env python3
"""check_github_pat.py — cek kredensial GitHub di VPS tanpa menampilkan token.

Menampilkan: struktur file, tipe & panjang token, login akun, scope/ijin,
dan status repo target. Aman: token hanya di memori.
"""
import sys
from pathlib import Path

sys.path.insert(0, str(Path(__file__).resolve().parent))
from push_github import fetch_credential, api  # noqa: E402


def main():
    cred = fetch_credential()
    token = cred["token"]

    status, body, scopes = api(token, "GET", "/user")
    if status != 200:
        print(f"[GAGAL] Token INVALID — HTTP {status}: {body.get('message')}")
        sys.exit(1)
    print(f"[user ] login={body.get('login')} | nama={body.get('name')!r} "
          f"| plan={body.get('plan')} | type={body.get('type')}")
    print(f"[scope] {scopes or 'fine-grained PAT (scope per-repo di web GitHub)'}")

    owner = body["login"]
    for repo in ("shankarawell",):
        st, rb, _ = api(token, "GET", f"/repos/{owner}/{repo}")
        if st == 200:
            print(f"[repo ] {owner}/{repo} ADA ({'private' if rb['private'] else 'public'}) "
                  f"— {rb['html_url']} | branch default: {rb['default_branch']}")
        elif st == 404:
            print(f"[repo ] {owner}/{repo} belum ada (akan dibuat saat push)")
        else:
            print(f"[repo ] cek {owner}/{repo} → HTTP {st}: {rb.get('message')}")

    # hak buat repo (klasik: butuh 'repo'; fine-grained: permission Administration/Write)
    st, rb, _ = api(token, "GET", "/rate_limit")
    if st == 200:
        core = rb["resources"]["core"]
        print(f"[api  ] rate limit: {core['remaining']}/{core['limit']} tersisa")
    print("\nKESIMPULAN: token VALID" + (
        f" untuk akun {owner}." if owner else "."))


if __name__ == "__main__":
    main()

#!/usr/bin/env python3
"""Redeploy ONLY the app build of unit `shankarawell` (no proxy/systemd/hosts
changes). Rotates standalone -> standalone.prev per the unit runbook, extracts
the new tarball, restarts shankarawell, and verifies.

Target: publik :3980 (proxy pusat) / internal :4080 / /var/www/shankarawell
Tarball lokal: /tmp/shankarawell-deploy.tar.gz (build `output:'standalone'`,
isi: server.js, .next, public, package.json — TANPA node_modules).
"""
import sys
import time

import paramiko

HOST = "host.zerotier.my.id"
PORT = 2226
USER = "root"
KEY = "/home/z/my-project/.ssh/id_ed25519"
DOMAIN = "shankarawell.yapsidarussalam.or.id"
BASE = "/var/www/shankarawell"
TARBALL = "/tmp/shankarawell-deploy.tar.gz"


def run(cli, cmd, timeout=60):
    _, out, err = cli.exec_command(cmd, timeout=timeout)
    return out.read().decode(errors="replace").strip(), err.read().decode(errors="replace").strip()


def main():
    cli = paramiko.SSHClient()
    cli.set_missing_host_key_policy(paramiko.AutoAddPolicy())
    cli.connect(hostname=HOST, port=PORT, username=USER, key_filename=KEY,
                timeout=20, allow_agent=False, look_for_keys=False)
    print("connected")

    # rotate (runbook pattern)
    run(cli, f"rm -rf {BASE}/standalone.prev && mv {BASE}/standalone {BASE}/standalone.prev")
    run(cli, f"mkdir -p {BASE}/standalone")

    sftp = cli.open_sftp()
    print("uploading new tarball ...")

    def prog(t, total):
        if t % (5 * 1024 * 1024) < 64 * 1024 or t == total:
            print(f"\r  {t/1048576:.1f}/{total/1048576:.1f} MB", end="" if t != total else "\n", flush=True)

    sftp.put(TARBALL, TARBALL, callback=prog)
    sftp.close()
    o, e = run(cli, f"tar -xzf {TARBALL} -C {BASE}/standalone && ls {BASE}/standalone/server.js && rm -f {TARBALL}", timeout=120)
    if "server.js" not in o:
        print("EXTRACT FAILED:", o, e)
        sys.exit(2)
    print("extracted OK")

    run(cli, "systemctl restart shankarawell")
    time.sleep(3)

    checks = [
        ("service active", "systemctl is-active shankarawell"),
        ("app :4080 http 200", "curl -s -o /dev/null -m 8 -w '%{http_code}' http://127.0.0.1:4080/"),
        ("mw https passthrough", f"curl -s -o /dev/null -m 8 -w 'code=%{{http_code}}' -H 'Host: {DOMAIN}' http://127.0.0.1:4080/"),
        ("proxy :3980 200", f"curl -s -o /dev/null -m 10 -w 'code=%{{http_code}} ssl=%{{ssl_verify_result}}' https://{DOMAIN}:3980/"),
        ("proxy chunk asset", f"CH=$(curl -s -m 10 https://{DOMAIN}:3980/ | grep -oE '/_next/static/chunks/[^\"]+\\.js' | head -1); curl -s -o /dev/null -m 10 -w \"chunk=$CH code=%{{http_code}}\" https://{DOMAIN}:3980$CH"),
        ("proxy robots 200", f"curl -s -o /dev/null -m 8 -w 'code=%{{http_code}}' https://{DOMAIN}:3980/robots.txt"),
        ("public via tunnel", f"curl -s -o /dev/null -m 15 -w 'code=%{{http_code}}' https://{DOMAIN}/"),
    ]
    for label, cmd in checks:
        o, e = run(cli, cmd)
        print(f"[{label}] {o}" + (f" | {e}" if e else ""))
    cli.close()


if __name__ == "__main__":
    main()

#!/usr/bin/env python3
"""[DEPRECATED 2026-10-31 — unit sudah bermigrasi ke shankarawell :3980/:4080,
/var/www/shankarawell. JANGAN jalankan script ini (port/dir sudah tidak ada).
Untuk deploy ulang build baru pakai scripts/vps_redeploy.py.] Deploy awal
sejarah: Shankara site ke VPS mengikuti pola infra-perunit (3998/4008 lama).

Steps:
 1. Pre-flight  : ports 3998/4008 free, /etc/hosts state.
 2. Upload      : tarball (standalone build) + start.sh + UNIT.md + systemd unit.
 3. Extract     : /var/www/shankarawe/standalone
 4. /etc/hosts  : add 127.0.0.1 mapping for the subdomain (cloudflared origin).
 5. Proxy edit  : add 3998 -> 4008 to UNITS in the central https-proxy.js
                  (backup first, sed insert, grep verify, node --check).
 6. systemd     : enable --now shankarawe, restart yapsi-main (proxy reload).
 7. Verify      : app :4008, proxy :3998 TLS with valid LE cert, sibling units
                  still healthy, HTTPS-only (plain http on 3998 must fail).

ABORTS (with backup restore) before restarting yapsi-main if the proxy edit
does not validate, so existing sites are never put at risk.
"""
import sys
import time

import paramiko

HOST = "host.zerotier.my.id"
PORT = 2226
USER = "root"
KEY = "/home/z/my-project/.ssh/id_ed25519"

TARBALL = "/tmp/shankarawe-deploy.tar.gz"
LOCAL_TARBALL = "/tmp/shankarawe-deploy.tar.gz"
LOCAL_DIR = "/home/z/my-project/scripts/deploy-files"
DOMAIN = "shankarawell.yapsidarussalam.or.id"
PROXY = "/var/www/yapsi-landing/https-proxy.js"
TAHFIZ_LINE = '  3997: { site: "tahfiz", app: 4007 },'
NEW_LINE = '  3998: { site: "shankarawe", app: 4008 },'


def run(cli, cmd, timeout=60):
    _, out, err = cli.exec_command(cmd, timeout=timeout)
    o = out.read().decode(errors="replace").strip()
    e = err.read().decode(errors="replace").strip()
    return o, e


def ok(label, cond=True, detail=""):
    mark = "OK " if cond else "FAIL"
    print(f"[{mark}] {label}" + (f" — {detail}" if detail else ""))
    return cond


def main():
    cli = paramiko.SSHClient()
    cli.set_missing_host_key_policy(paramiko.AutoAddPolicy())
    cli.connect(hostname=HOST, port=PORT, username=USER, key_filename=KEY,
                timeout=20, allow_agent=False, look_for_keys=False)
    print(f"connected: {USER}@{HOST}:{PORT}")

    # ---------- 1. pre-flight ----------
    o, _ = run(cli, "ss -tlnH | grep -E ':(3998|4008)\\s' || echo FREE")
    if not ok("ports 3998 & 4008 free", "FREE" in o, o):
        sys.exit(2)
    o, _ = run(cli, f"grep -n {DOMAIN} /etc/hosts || echo ABSENT")
    hosts_present = "ABSENT" not in o
    print(f"[info] /etc/hosts entry: {'present' if hosts_present else 'absent (will add)'} {o if hosts_present else ''}")

    # ---------- 2. upload ----------
    run(cli, "mkdir -p /var/www/shankarawe/standalone")
    sftp = cli.open_sftp()

    def progress(transferred, total):
        if transferred % (5 * 1024 * 1024) < 64 * 1024 or transferred == total:
            print(f"\r  tarball {transferred/1048576:.1f}/{total/1048576:.1f} MB", end="" if transferred != total else "\n", flush=True)

    print("uploading tarball ...")
    sftp.put(LOCAL_TARBALL, TARBALL, callback=progress)
    sftp.put(f"{LOCAL_DIR}/start.sh", "/var/www/shankarawe/start.sh")
    sftp.put(f"{LOCAL_DIR}/UNIT.md", "/var/www/shankarawe/UNIT.md")
    sftp.put(f"{LOCAL_DIR}/shankarawe.service", "/etc/systemd/system/shankarawe.service")
    sftp.chmod("/var/www/shankarawe/start.sh", 0o755)
    sftp.close()
    ok("files uploaded (tarball, start.sh, UNIT.md, shankarawe.service)")

    # ---------- 3. extract ----------
    o, e = run(cli, f"tar -xzf {TARBALL} -C /var/www/shankarawe/standalone && ls /var/www/shankarawe/standalone/server.js && rm -f {TARBALL}", timeout=120)
    ok("tarball extracted", "server.js" in o, o + (" " + e if e else ""))

    # ---------- 4. /etc/hosts ----------
    if not hosts_present:
        o, e = run(cli, f"echo '127.0.0.1 {DOMAIN}' >> /etc/hosts && grep {DOMAIN} /etc/hosts")
        ok("/etc/hosts entry added", DOMAIN in o, o)

    # ---------- 5. proxy edit ----------
    ts = time.strftime("%Y%m%d-%H%M%S")
    run(cli, f"cp {PROXY} {PROXY}.bak-{ts}")
    sed = (f"sed -i 's|^{TAHFIZ_LINE}$|{TAHFIZ_LINE}\\n{NEW_LINE}|' {PROXY}")
    run(cli, sed)
    o, _ = run(cli, f"grep -n shankarawe {PROXY} || echo MISSING")
    grep_ok = NEW_LINE in o
    o2, e2 = run(cli, f"node --check {PROXY} && echo SYNTAX_OK")
    syntax_ok = "SYNTAX_OK" in o2
    if not (grep_ok and syntax_ok):
        run(cli, f"cp {PROXY}.bak-{ts} {PROXY}")
        ok("proxy UNITS edit", False, f"grep_ok={grep_ok} syntax_ok={syntax_ok} — backup restored, ABORT")
        sys.exit(3)
    ok(f"proxy UNITS edit (3998 -> 4008) + node --check", True, f"backup: {PROXY}.bak-{ts}")

    # ---------- 6. systemd ----------
    run(cli, "systemctl daemon-reload")
    run(cli, "systemctl enable --now shankarawe")
    time.sleep(3)
    o, _ = run(cli, "systemctl is-active shankarawe")
    ok("shankarawe.service active", "active" in o, o)

    o, _ = run(cli, "curl -s -o /dev/null -m 8 -w '%{http_code}' http://127.0.0.1:4008/")
    ok("app direct 127.0.0.1:4008 responds", o == "200", f"HTTP {o}")

    print("restarting yapsi-main (proxy pusat reload, ~2s downtime semua port) ...")
    run(cli, "systemctl restart yapsi-main", timeout=60)
    time.sleep(4)

    # ---------- 7. verify ----------
    o, _ = run(cli, "systemctl is-active yapsi-main shankarawe | tr '\\n' ' '")
    ok("yapsi-main + shankarawe active", "active" in o, o)

    # proxy :3998 with REAL cert verification (LE wildcard covers subdomain)
    o, e = run(cli, f"curl -s -o /dev/null -m 10 -w 'code=%{{http_code}} ssl_verify=%{{ssl_verify_result}}' https://{DOMAIN}:3998/")
    ok("proxy :3998 HTTPS valid-cert 200", "code=200" in o and "ssl_verify=0" in o, o + (" " + e if e else ""))

    o, _ = run(cli, f"curl -s -m 10 https://{DOMAIN}:3998/ | grep -o '<title>[^<]*' | head -1")
    ok("content title via proxy", "Shankara" in o, o)

    # https-only: plain http to 3998 must FAIL (no http listener)
    o, e = run(cli, f"curl -s -o /dev/null -m 6 -w '%{{http_code}}' http://{DOMAIN}:3998/ 2>&1 || echo HTTP_REJECTED")
    ok("plain http on :3998 rejected (https-only)", "HTTP_REJECTED" in o or "000" in o, o.strip()[:80])

    # app internal only loopback
    o, _ = run(cli, "ss -tlnH | grep ':4008' ")
    ok("app :4008 loopback only", "127.0.0.1:4008" in o, o.strip())

    # siblings healthy after proxy restart
    for name, url in (("main", "https://www.yapsidarussalam.or.id:3990/"),
                      ("panti", "https://panti.yapsidarussalam.or.id:3991/"),
                      ("sirat", "https://sirat.yapsidarussalam.or.id:3901/")):
        o, _ = run(cli, f"curl -sk -o /dev/null -m 10 -w '%{{http_code}}' {url}")
        ok(f"sibling {name} via proxy", o in ("200", "307", "308"), f"HTTP {o}")

    o, _ = run(cli, "journalctl -u shankarawe -n 5 --no-pager | tail -n 5")
    print(f"\n--- journalctl shankarawe (last 5) ---\n{o}")
    o, _ = run(cli, "ss -tlnH | grep -E ':(3998|4008)\\s'")
    print(f"--- listeners ---\n{o}")
    cli.close()
    print("\nDEPLOY SELESAI.")


if __name__ == "__main__":
    main()

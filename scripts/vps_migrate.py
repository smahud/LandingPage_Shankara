#!/usr/bin/env python3
"""Migrate shankarawe -> shankarawell per owner's port scheme (2026-10-31).

Owner's decision: 399x reserved for YAPSI projects; 397x-398x for other
projects. shankarawell moves to public :3980, internal digit-match :4080,
directory /var/www/shankarawell. The Cloudflare tunnel is ALREADY pointed at
https://shankarawell.yapsidarussalam.or.id:3980 (cloudflared config v66), so
the public URL is down until :3980 goes live — migrate in one pass.

Steps:
 1. Pre-flight : shankarawe active, app :4008 200, ports 3980/4080 free.
 2. Stop shankarawe; mv /var/www/shankarawe -> /var/www/shankarawell.
 3. Upload new start.sh (PORT=4080) + shankarawell.service; drop old unit.
 4. Proxy UNITS edit: backup, insert 3980 line, delete 3998 line, add comment,
    grep verify + node --check (auto-restore backup on failure, ABORT).
 5. daemon-reload; enable --now shankarawell; restart yapsi-main (proxy reload).
 6. Verify: app loopback, proxy :3980 TLS 200 valid cert, https-only, HSTS,
    middleware 308, siblings healthy, 3998 freed, journal clean.
 7. Decode tunnel IDs (IDs only, never tokens) for the docs.
"""
import sys
import time

import paramiko

HOST = "host.zerotier.my.id"
PORT = 2226
USER = "root"
KEY = "/home/z/my-project/.ssh/id_ed25519"
DOMAIN = "shankarawell.yapsidarussalam.or.id"
PROXY = "/var/www/yapsi-landing/https-proxy.js"
LOCAL_DIR = "/home/z/my-project/scripts/deploy-files"

SIBLINGS = [
    ("main www", "https://www.yapsidarussalam.or.id:3990/"),
    ("panti", f"https://panti.yapsidarussalam.or.id:3991/"),
    ("kb-ra", f"https://kb-ra.yapsidarussalam.or.id:3992/"),
    ("mi", f"https://mi.yapsidarussalam.or.id:3993/"),
    ("mts", f"https://mts.yapsidarussalam.or.id:3994/"),
    ("masjid", f"https://masjid.yapsidarussalam.or.id:3995/"),
    ("ponpes", f"https://ponpes.yapsidarussalam.or.id:3996/"),
    ("tahfiz", f"https://tahfiz.yapsidarussalam.or.id:3997/"),
    ("sirat", f"https://sirat.yapsidarussalam.or.id:3901/"),
]


def run(cli, cmd, timeout=60):
    _, out, err = cli.exec_command(cmd, timeout=timeout)
    o = out.read().decode(errors="replace").strip()
    e = err.read().decode(errors="replace").strip()
    return o, e


def ok(label, cond, detail=""):
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
    o, _ = run(cli, "systemctl is-active shankarawe")
    if not ok("shankarawe currently active", o == "active", o):
        sys.exit(2)
    o, _ = run(cli, "curl -s -o /dev/null -m 8 -w '%{http_code}' http://127.0.0.1:4008/")
    if not ok("app :4008 responds 200", o == "200", f"HTTP {o}"):
        sys.exit(2)
    o, _ = run(cli, "ss -tlnH | grep -E ':(3980|4080)\\s' || echo FREE")
    if not ok("ports 3980 & 4080 free", "FREE" in o, o):
        sys.exit(2)
    o, _ = run(cli, "test -d /var/www/shankarawell && echo EXISTS || echo ABSENT")
    if not ok("target dir /var/www/shankarawell absent", "ABSENT" in o, o):
        sys.exit(2)

    # ---------- 2. stop + move ----------
    run(cli, "systemctl stop shankarawe")
    o, _ = run(cli, "systemctl is-active shankarawe || true")
    ok("shankarawe stopped", o != "active", o or "inactive")
    o, e = run(cli, "mv /var/www/shankarawe /var/www/shankarawell && ls /var/www/shankarawell")
    if not ok("directory moved -> /var/www/shankarawell", "standalone" in o, o + (" " + e if e else "")):
        sys.exit(3)

    # ---------- 3. upload unit files ----------
    sftp = cli.open_sftp()
    sftp.put(f"{LOCAL_DIR}/start.sh", "/var/www/shankarawell/start.sh")
    sftp.put(f"{LOCAL_DIR}/shankarawell.service", "/etc/systemd/system/shankarawell.service")
    sftp.chmod("/var/www/shankarawell/start.sh", 0o755)
    sftp.close()
    run(cli, "rm -f /etc/systemd/system/shankarawe.service")
    ok("start.sh (PORT=4080) + shankarawell.service uploaded; old unit removed")

    # ---------- 4. proxy edit ----------
    ts = time.strftime("%Y%m%d-%H%M%S")
    bak = f"{PROXY}.bak-{ts}"
    run(cli, f"cp {PROXY} {bak}")
    run(cli, f"sed -i 's|^const UNITS = {{$|&\\n  3980: {{ site: \"shankarawell\", app: 4080 }},|' {PROXY}")
    run(cli, f"sed -i '/3998: {{ site: \"shankarawe\", app: 4008 }}/d' {PROXY}")
    run(cli, f"sed -i '/3997 (tahfiz)/a\\ *   3980 (shankarawell, NON-yapsi) → 127.0.0.1:4080  header x-yapsi-site: shankarawell' {PROXY}")
    o, _ = run(cli, f"grep -cF 'site: \"shankarawe\"' {PROXY} || true")
    old_gone = o in ("0", "")
    o, _ = run(cli, f"grep -cF '3980: {{ site: \"shankarawell\", app: 4080 }}' {PROXY}")
    new_present = o == "1"
    o2, _ = run(cli, f"node --check {PROXY} && echo SYNTAX_OK")
    syntax_ok = "SYNTAX_OK" in o2
    if not (old_gone and new_present and syntax_ok):
        run(cli, f"cp {bak} {PROXY}")
        ok("proxy UNITS edit", False,
           f"old_gone={old_gone} new_present={new_present} syntax_ok={syntax_ok} — backup restored, ABORT")
        sys.exit(4)
    ok("proxy UNITS edit: +3980->4080 shankarawell, -3998->4008 shankarawe", True, f"backup: {bak}")

    # ---------- 5. systemd ----------
    run(cli, "systemctl daemon-reload")
    run(cli, "systemctl enable --now shankarawell")
    time.sleep(3)
    o, _ = run(cli, "systemctl is-active shankarawell")
    if not ok("shankarawell.service active", o == "active", o):
        o, _ = run(cli, "journalctl -u shankarawell -n 15 --no-pager")
        print(o)
        sys.exit(5)
    o, _ = run(cli, "curl -s -o /dev/null -m 8 -w '%{http_code}' http://127.0.0.1:4080/")
    ok("app direct 127.0.0.1:4080 responds", o == "200", f"HTTP {o}")

    print("restarting yapsi-main (proxy pusat reload, ~2s downtime semua port) ...")
    run(cli, "systemctl restart yapsi-main", timeout=90)
    time.sleep(4)

    # ---------- 6. verify ----------
    o, _ = run(cli, "systemctl is-active yapsi-main shankarawell | tr '\\n' ' '")
    ok("yapsi-main + shankarawell active", o == "active active ", o)

    o, _ = run(cli, "ss -tlnH | grep ':4080' ")
    ok("app :4080 loopback only", "127.0.0.1:4080" in o, o.strip())
    o, _ = run(cli, "ss -tlnH | grep -E ':(4008|3998)\\s' || echo FREED")
    ok("old ports 3998 & 4008 freed (3998 kembali utk yapsi)", "FREED" in o, o.strip())

    o, _ = run(cli, f"curl -s -o /dev/null -m 10 -w 'code=%{{http_code}} ssl_verify=%{{ssl_verify_result}}' https://{DOMAIN}:3980/")
    ok("proxy :3980 HTTPS valid-cert 200", "code=200" in o and "ssl_verify=0" in o, o)

    o, _ = run(cli, f"curl -s -m 10 https://{DOMAIN}:3980/ | grep -o '<title>[^<]*' | head -1")
    ok("content title via :3980", "Shankara" in o, o)

    o, e = run(cli, f"curl -s -o /dev/null -m 6 -w '%{{http_code}}' http://{DOMAIN}:3980/ 2>&1 || echo HTTP_REJECTED")
    ok("plain http on :3980 rejected (https-only)", "HTTP_REJECTED" in o or "000" in o, o.strip()[:60])

    o, _ = run(cli, f"curl -sk -o /dev/null -m 8 -w 'code=%{{http_code}} loc=%{{redirect_url}}' -H 'cf-visitor: {{\"scheme\":\"http\"}}' https://{DOMAIN}:3980/")
    ok("middleware 308 http->https (cf-visitor)", "code=308" in o and f"https://{DOMAIN}" in o, o)

    o, _ = run(cli, f"curl -sIk -m 8 https://{DOMAIN}:3980/ | grep -i strict-transport")
    ok("HSTS header via proxy", "strict-transport" in o.lower(), o.strip())

    o, _ = run(cli, f"CH=$(curl -s -m 10 https://{DOMAIN}:3980/ | grep -oE '/_next/static/chunks/[^\\\"]+\\.js' | head -1); curl -s -o /dev/null -m 10 -w \"code=%{{http_code}}\" https://{DOMAIN}:3980$CH")
    ok("chunk asset via :3980", "code=200" in o, o)

    for name, url in SIBLINGS:
        o, _ = run(cli, f"curl -sk -o /dev/null -m 10 -w '%{{http_code}}' {url}")
        ok(f"sibling {name} healthy", o in ("200", "307", "308"), f"HTTP {o}")

    o, _ = run(cli, "journalctl -u shankarawell -n 6 --no-pager | tail -6")
    print(f"\n--- journalctl shankarawell (last 6) ---\n{o}")
    o, _ = run(cli, "ss -tlnH | grep -E ':(3980|4080)\\s'")
    print(f"--- new listeners ---\n{o}")

    # ---------- 7. tunnel IDs (for /root/PORT_MAPPING.md) ----------
    for svc in ("cloudflared", "cloudflared2nd"):
        cmd = (f"TOKEN=$(systemctl cat {svc} 2>/dev/null | grep -oP '(?<=--token )\\S+' | head -1); "
               f"echo \"$TOKEN\" | python3 -c \"import sys,json,base64; s=sys.stdin.read().strip(); "
               f"s+= '='*(-len(s)%4); d=json.loads(base64.urlsafe_b64decode(s)); "
               f"print('{svc} tunnel_id:', d.get('t'), '| account:', d.get('a'))\" 2>/dev/null || echo '{svc} decode-failed'")
        o, _ = run(cli, cmd)
        print(f"[tunnel] {o}")

    cli.close()
    print("\nMIGRASI SELESAI — shankarawell kini di :3980 (publik) / :4080 (internal), /var/www/shankarawell")


if __name__ == "__main__":
    main()

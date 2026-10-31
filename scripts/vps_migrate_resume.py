#!/usr/bin/env python3
"""Resume migration after the dir-move + unit-upload already succeeded.
Remaining: proxy UNITS edit (3998->3980), start shankarawell, reload
yapsi-main, full verification, tunnel IDs."""
import sys
import time

import paramiko

HOST = "host.zerotier.my.id"
PORT = 2226
USER = "root"
KEY = "/home/z/my-project/.ssh/id_ed25519"
DOMAIN = "shankarawell.yapsidarussalam.or.id"
PROXY = "/var/www/yapsi-landing/https-proxy.js"

SIBLINGS = [
    ("main www", "https://www.yapsidarussalam.or.id:3990/"),
    ("panti", "https://panti.yapsidarussalam.or.id:3991/"),
    ("kb-ra", "https://kb-ra.yapsidarussalam.or.id:3992/"),
    ("mi", "https://mi.yapsidarussalam.or.id:3993/"),
    ("mts", "https://mts.yapsidarussalam.or.id:3994/"),
    ("masjid", "https://masjid.yapsidarussalam.or.id:3995/"),
    ("ponpes", "https://ponpes.yapsidarussalam.or.id:3996/"),
    ("tahfiz", "https://tahfiz.yapsidarussalam.or.id:3997/"),
    ("sirat", "https://sirat.yapsidarussalam.or.id:3901/"),
]


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

    # ---------- state check (resume-safe) ----------
    o, _ = run(cli, "test -f /var/www/shankarawell/start.sh && echo YES || echo NO")
    if not ok("start.sh present in /var/www/shankarawell", "YES" in o, o):
        sys.exit(2)
    o, _ = run(cli, "test -f /etc/systemd/system/shankarawell.service && echo YES || echo NO")
    if not ok("shankarawell.service unit file present", "YES" in o, o):
        sys.exit(2)
    o, _ = run(cli, "grep -cF '3980: { site: \"shankarawell\", app: 4080 }' %s || true" % PROXY)
    already = o == "1"
    print(f"[info] proxy UNITS edit already applied: {already}")

    if not already:
        # ---------- proxy edit ----------
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

    # ---------- systemd ----------
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

    # ---------- verify ----------
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

    # ---------- tunnel IDs (for /root/PORT_MAPPING.md) ----------
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

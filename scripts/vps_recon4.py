#!/usr/bin/env python3
"""Recon pass 4: full current state needed to migrate shankarawe (3998/4008,
/var/www/shankarawe) -> shankarawell (3980/4080, /var/www/shankarawell)
and to author /root/PORT_MAPPING.md."""
import paramiko

HOST = "host.zerotier.my.id"
PORT = 2226
KEY = "/home/z/my-project/.ssh/id_ed25519"
USER = "root"

CMDS = [
    # --- services & units ---
    ("units-running", "systemctl list-units --type=service --state=running --no-pager --plain | grep -Ei 'yapsi|shankara|cloudflared|node|nginx|caddy|tahfiz|sirat|panti|masjid' || true"),
    ("unit-files", "ls -1 /etc/systemd/system/*.service 2>/dev/null | grep -Ei 'yapsi|shankara|cloudflared|tahfiz|sirat|panti|masjid' || true"),
    ("shankarawe-status", "systemctl is-active shankarawe; systemctl cat shankarawe --no-pager | head -20"),
    ("yapsi-main-unit", "systemctl cat yapsi-main --no-pager | head -25"),
    # --- listeners & port occupancy ---
    ("listeners-all", "ss -tlnH | sort"),
    ("port-range-39xx", "ss -tlnH | grep -E ':(39[0-9][0-9])\\s' || echo none"),
    ("port-range-40xx", "ss -tlnH | grep -E ':(40[0-9][0-9])\\s' || echo none"),
    ("ports-3980-4080", "ss -tlnH | grep -E ':(3980|4080)\\s' || echo FREE-BOTH"),
    # --- proxy pusat full source (UNITS map + routing logic) ---
    ("proxy-full", "cat /var/www/yapsi-landing/https-proxy.js"),
    ("yapsi-landing-ls", "ls -la /var/www/yapsi-landing/ | head -20"),
    ("readme-perunit", "cat /var/www/yapsi-landing/README-PERUNIT.md 2>/dev/null | head -100"),
    # --- app dir & logs ---
    ("shankarawe-dir", "ls -la /var/www/shankarawe/ 2>/dev/null; du -sh /var/www/shankarawe 2>/dev/null"),
    ("app-log-tail", "tail -5 /var/www/shankarawe/next.log 2>/dev/null"),
    ("www-ls", "ls -la /var/www/"),
    # --- hosts & certs ---
    ("etc-hosts", "grep -v '^#' /etc/hosts | grep -v '^$'"),
    ("cert-expiry", "openssl x509 -in /etc/letsencrypt/live/yapsidarussalam.or.id/fullchain.pem -noout -enddate"),
    ("cert-san", "openssl x509 -in /etc/letsencrypt/live/yapsidarussalam.or.id/fullchain.pem -noout -ext subjectAltName 2>/dev/null | tail -3"),
    # --- cloudflared tunnel ingress (where does the hostname point NOW?) ---
    ("cf1-ingress", "journalctl -u cloudflared --no-pager -n 5000 2>/dev/null | grep -iE 'shankara|3998|3980' | tail -15"),
    ("cf2-ingress", "journalctl -u cloudflared2nd --no-pager -n 5000 2>/dev/null | grep -iE 'shankara|3998|3980' | tail -10"),
    ("cf-services", "systemctl is-active cloudflared cloudflared2nd 2>/dev/null; systemctl cat cloudflared --no-pager 2>/dev/null | grep -oE '(ExecStart=.*|--token)[^ ]*' | sed 's/--token.*/--token [REDACTED]/' | head -3"),
    # --- live checks ---
    ("app-4008", "curl -s -o /dev/null -m 8 -w '%{http_code}' http://127.0.0.1:4008/"),
    ("proxy-3998", "curl -s -o /dev/null -m 10 -w 'code=%{http_code} ssl_verify=%{ssl_verify_result}' https://shankarawell.yapsidarussalam.or.id:3998/"),
    ("public-tunnel", "curl -s -o /dev/null -m 15 -w 'code=%{http_code}' https://shankarawell.yapsidarussalam.or.id/"),
    # --- system ---
    ("disk-mem", "df -h / | tail -1; free -h | head -2"),
    ("os", "head -2 /etc/os-release; node -v 2>/dev/null"),
    ("root-ls", "ls -la /root/ | head -20"),
]


def main():
    cli = paramiko.SSHClient()
    cli.set_missing_host_key_policy(paramiko.AutoAddPolicy())
    cli.connect(hostname=HOST, port=PORT, username=USER, key_filename=KEY,
                timeout=20, allow_agent=False, look_for_keys=False)
    print(f"connected: {USER}@{HOST}:{PORT}\n")
    for label, cmd in CMDS:
        try:
            _, out, _ = cli.exec_command(cmd, timeout=40)
            text = out.read().decode(errors="replace").strip()
            print(f"\n=== {label} ===\n{text if text else '(empty)'}")
        except Exception as e:
            print(f"\n=== {label} === ERROR {type(e).__name__}: {e}")
    cli.close()


if __name__ == "__main__":
    main()

#!/usr/bin/env python3
"""Recon pass 3: read the unit runbook, start.sh patterns, rest of the proxy
source, LE cert SANs, cloudflared ingress logs (recent), and safely decode
tunnel IDs (IDs only, never tokens)."""
import paramiko

HOST = "host.zerotier.my.id"
PORT = 2226
KEY = "/home/z/my-project/.ssh/id_ed25519"
USER = "root"

CMDS = [
    ("readme-perunit", "head -80 /var/www/yapsi-landing/README-PERUNIT.md 2>/dev/null"),
    ("masjid-start", "cat /var/www/yapsi-masjid/start.sh 2>/dev/null"),
    ("masjid-unit-md", "cat /var/www/yapsi-masjid/UNIT.md 2>/dev/null"),
    ("sirat-start", "cat /var/www/sirat/start.sh 2>/dev/null"),
    ("proxy-rest", "sed -n '100,240p' /var/www/yapsi-landing/https-proxy.js 2>/dev/null"),
    ("cert-san", "openssl x509 -in /etc/letsencrypt/live/yapsidarussalam.or.id/fullchain.pem -noout -ext subjectAltName 2>/dev/null"),
    ("cert-expiry", "openssl x509 -in /etc/letsencrypt/live/yapsidarussalam.or.id/fullchain.pem -noout -enddate 2>/dev/null"),
    ("cf-journal", "journalctl -u cloudflared --no-pager -n 4000 2>/dev/null | grep -iE 'ingress|configuration|hostname|shankara' | tail -30"),
    ("cf2-journal", "journalctl -u cloudflared2nd --no-pager -n 4000 2>/dev/null | grep -iE 'ingress|configuration|hostname|shankara' | tail -20"),
    ("tunnel-id-1", "TOKEN=$(systemctl cat cloudflared 2>/dev/null | grep -oP '(?<=--token )\\S+' | head -1); echo \"$TOKEN\" | python3 -c \"import sys,json,base64; s=sys.stdin.read().strip(); s+= '='*(-len(s)%4); d=json.loads(base64.urlsafe_b64decode(s)); print('cloudflared  -> tunnel_id:', d.get('t'), '| account:', d.get('a'))\" 2>/dev/null || echo decode-failed"),
    ("tunnel-id-2", "TOKEN=$(systemctl cat cloudflared2nd 2>/dev/null | grep -oP '(?<=--token )\\S+' | head -1); echo \"$TOKEN\" | python3 -c \"import sys,json,base64; s=sys.stdin.read().strip(); s+= '='*(-len(s)%4); d=json.loads(base64.urlsafe_b64decode(s)); print('cloudflared2nd -> tunnel_id:', d.get('t'), '| account:', d.get('a'))\" 2>/dev/null || echo decode-failed"),
    ("sibling-panti", "curl -skI -m 8 https://panti.yapsidarussalam.or.id/ 2>&1 | head -4"),
    ("sibling-mts", "curl -skI -m 8 https://mts.yapsidarussalam.or.id/ 2>&1 | head -4"),
    ("sirat-public", "curl -skI -m 8 https://sirat.yapsidarussalam.or.id/ 2>&1 | head -4"),
]


def main():
    cli = paramiko.SSHClient()
    cli.set_missing_host_key_policy(paramiko.AutoAddPolicy())
    cli.connect(hostname=HOST, port=PORT, username=USER, key_filename=KEY,
                timeout=20, allow_agent=False, look_for_keys=False)
    for label, cmd in CMDS:
        try:
            _, out, _ = cli.exec_command(cmd, timeout=30)
            text = out.read().decode(errors="replace").strip()
            print(f"\n=== {label} ===\n{text if text else '(empty)'}")
        except Exception as e:
            print(f"\n=== {label} === ERROR {type(e).__name__}: {e}")
    cli.close()


if __name__ == "__main__":
    main()

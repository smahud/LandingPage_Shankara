#!/usr/bin/env python3
"""Recon pass 2: study the established deployment pattern on the VPS
(systemd units of sibling Next.js apps, https-proxy.js, port map), and
diagnose the current 403 on the subdomain."""
import sys

import paramiko

HOST = "host.zerotier.my.id"
PORT = 2226
KEY = "/home/z/my-project/.ssh/id_ed25519"
USER = "root"
REDACT = "sed -E 's/[A-Za-z0-9+_/=-]{28,}/<REDACTED>/g'"
UA = "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/126.0 Safari/537.36"

CMDS = [
    ("units", "ls /etc/systemd/system/ | grep -E '\\.service$' | tr '\\n' ' '"),
    ("yapsi-main", "systemctl cat yapsi-main.service 2>/dev/null"),
    ("yapsi-masjid", "systemctl cat yapsi-masjid.service 2>/dev/null"),
    ("yapsi-ponpes", "systemctl cat yapsi-ponpes.service 2>/dev/null"),
    ("sirat", "systemctl cat sirat.service 2>/dev/null"),
    ("cf2nd", f"systemctl cat cloudflared2nd.service 2>/dev/null | {REDACT}"),
    ("ss-ports", "ss -tlnp | grep -E ':(80|443|39[0-9]{{2}})\\s' | sed 's/users:((//;s/))//'"),
    ("proxy-cwd", "readlink /proc/10122/cwd 2>/dev/null; readlink /proc/89561/cwd 2>/dev/null; tr '\\0' ' ' < /proc/10122/cmdline 2>/dev/null; echo; tr '\\0' ' ' < /proc/89561/cmdline 2>/dev/null; echo"),
    ("proxy-src", "cat \"$(readlink /proc/10122/cwd 2>/dev/null)/https-proxy.js\" 2>/dev/null | head -100"),
    ("landing-structure", "ls -la /var/www/yapsi-landing/ | head -20"),
    ("masjid-structure", "ls -la /var/www/yapsi-masjid/ | head -12"),
    ("grep-subdomain", "grep -ril shankarawell /etc /root /usr/local/lsws/conf 2>/dev/null | head -10"),
    ("lsws-vhosts", "ls /usr/local/lsws/conf/vhosts/ 2>/dev/null | head -20"),
    ("403-headers", f"curl -skI -m 8 https://shankarawell.yapsidarussalam.or.id/ -A '{UA}' | head -16"),
    ("403-body", f"curl -sk -m 8 https://shankarawell.yapsidarussalam.or.id/ -A '{UA}' | head -c 500; echo"),
]


def main():
    cli = paramiko.SSHClient()
    cli.set_missing_host_key_policy(paramiko.AutoAddPolicy())
    cli.connect(hostname=HOST, port=PORT, username=USER, key_filename=KEY,
                timeout=20, allow_agent=False, look_for_keys=False)
    for label, cmd in CMDS:
        try:
            _, out, err = cli.exec_command(cmd, timeout=25)
            text = out.read().decode(errors="replace").strip()
            print(f"\n=== {label} ===\n{text if text else '(empty)'}")
        except Exception as e:
            print(f"\n=== {label} === ERROR {type(e).__name__}: {e}")
    cli.close()


if __name__ == "__main__":
    main()

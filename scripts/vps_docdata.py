#!/usr/bin/env python3
"""Final data gathering for /root/PORT_MAPPING.md authoring."""
import paramiko

HOST = "host.zerotier.my.id"
PORT = 2226
USER = "root"
KEY = "/home/z/my-project/.ssh/id_ed25519"

CMDS = [
    ("yapsi-dirs", "ls -d /var/www/yapsi-* /var/www/sirat /var/www/shankarawell 2>/dev/null"),
    ("unit-workdirs", "grep -h WorkingDirectory /etc/systemd/system/yapsi-*.service /etc/systemd/system/sirat.service /etc/systemd/system/shankarawell.service 2>/dev/null"),
    ("cf2-latest-config", "journalctl -u cloudflared2nd --no-pager -n 3000 2>/dev/null | grep 'Updated to new configuration' | tail -1"),
    ("certbot-dryrun-state", "systemctl list-timers --no-pager 2>/dev/null | grep -i certbot || echo no-certbot-timer"),
    ("root-md-files", "ls /root/*.md 2>/dev/null || echo none"),
    ("shankara-unitmd", "head -12 /var/www/shankarawell/UNIT.md"),
    ("dns-hosts-final", "grep -E 'yapsidarussalam|ulfasanda' /etc/hosts"),
]


def main():
    cli = paramiko.SSHClient()
    cli.set_missing_host_key_policy(paramiko.AutoAddPolicy())
    cli.connect(hostname=HOST, port=PORT, username=USER, key_filename=KEY,
                timeout=20, allow_agent=False, look_for_keys=False)
    for label, cmd in CMDS:
        _, out, _ = cli.exec_command(cmd, timeout=40)
        text = out.read().decode(errors="replace").strip()
        print(f"\n=== {label} ===\n{text if text else '(empty)'}")
    cli.close()


if __name__ == "__main__":
    main()

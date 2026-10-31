#!/usr/bin/env python3
"""Check recent cloudflared logs for the shankarawell origin attempts to
confirm the 502 cause (expected: service still port 443 -> LiteSpeed reject),
then final status snapshot."""
import paramiko

HOST = "host.zerotier.my.id"
PORT = 2226
KEY = "/home/z/my-project/.ssh/id_ed25519"

CMDS = [
    ("cf-recent", "journalctl -u cloudflared --no-pager --since '15 minutes ago' | grep -iE 'shankara|ingress|configuration' | tail -12"),
    ("cf2-recent", "journalctl -u cloudflared2nd --no-pager --since '15 minutes ago' | grep -iE 'shankara|ingress|configuration' | tail -8"),
    ("summary", "ss -tlnH | grep -E ':(3998|4008)\\s'; systemctl is-active shankarawe yapsi-main cloudflared | tr '\\n' ' '"),
]


def main():
    cli = paramiko.SSHClient()
    cli.set_missing_host_key_policy(paramiko.AutoAddPolicy())
    cli.connect(hostname=HOST, port=PORT, username="root", key_filename=KEY,
                timeout=20, allow_agent=False, look_for_keys=False)
    for label, cmd in CMDS:
        _, out, _ = cli.exec_command(cmd, timeout=30)
        print(f"=== {label} ===\n{out.read().decode(errors='replace').strip()}\n")
    cli.close()


if __name__ == "__main__":
    main()

#!/usr/bin/env python3
"""Connectivity + auth test against the user's VPS once they add our public key.

Usage:
  python3 scripts/ssh_check.py <host> [user] [port]

Example:
  python3 scripts/ssh_check.py 103.12.34.56 root 22
"""
import sys

import paramiko

KEY_PATH = "/home/z/my-project/.ssh/id_ed25519"


def main():
    if len(sys.argv) < 2:
        print("usage: ssh_check.py <host> [user=root] [port=22]")
        sys.exit(2)
    host = sys.argv[1]
    user = sys.argv[2] if len(sys.argv) > 2 else "root"
    port = int(sys.argv[3]) if len(sys.argv) > 3 else 22

    client = paramiko.SSHClient()
    client.set_missing_host_key_policy(paramiko.AutoAddPolicy())
    try:
        client.connect(
            hostname=host,
            port=port,
            username=user,
            key_filename=KEY_PATH,
            timeout=15,
            banner_timeout=15,
            auth_timeout=15,
            allow_agent=False,
            look_for_keys=False,
        )
    except paramiko.AuthenticationException:
        print("CONNECTED to SSH but AUTH FAILED — public key not yet in authorized_keys")
        sys.exit(3)
    except Exception as e:
        print(f"CONNECTION FAILED: {type(e).__name__}: {e}")
        sys.exit(4)

    for label, cmd in (
        ("whoami", "whoami"),
        ("os", "cat /etc/os-release | head -2"),
        ("kernel-arch", "uname -m"),
        ("node", "command -v node && node -v || echo none"),
        ("npm", "command -v npm && npm -v || echo none"),
        ("caddy", "command -v caddy && caddy version || echo none"),
        ("nginx", "command -v nginx && nginx -v || echo none"),
        ("ports-80-3000", "(command -v ss >/dev/null && ss -tln | grep -E ':(80|443|3000)\\b') || echo none"),
        ("disk", "df -h / | tail -1"),
    ):
        _, stdout, _ = client.exec_command(cmd, timeout=15)
        out = stdout.read().decode().strip()
        print(f"[{label}] {out}")
    client.close()
    print("SSH AUTH OK — ready to deploy.")


if __name__ == "__main__":
    main()

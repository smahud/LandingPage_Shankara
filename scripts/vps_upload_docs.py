#!/usr/bin/env python3
"""Upload /root/PORT_MAPPING.md + /var/www/shankarawell/UNIT.md, verify,
and read /root/NEXT-AGENT-PLAN.md to check for stale shankarawe references."""
import paramiko

HOST = "host.zerotier.my.id"
PORT = 2226
USER = "root"
KEY = "/home/z/my-project/.ssh/id_ed25519"
LOCAL_DIR = "/home/z/my-project/scripts/deploy-files"


def run(cli, cmd, timeout=40):
    _, out, err = cli.exec_command(cmd, timeout=timeout)
    return (out.read().decode(errors="replace").strip(),
            err.read().decode(errors="replace").strip())


def main():
    cli = paramiko.SSHClient()
    cli.set_missing_host_key_policy(paramiko.AutoAddPolicy())
    cli.connect(hostname=HOST, port=PORT, username=USER, key_filename=KEY,
                timeout=20, allow_agent=False, look_for_keys=False)
    print("connected")

    sftp = cli.open_sftp()
    sftp.put(f"{LOCAL_DIR}/PORT_MAPPING.md", "/root/PORT_MAPPING.md")
    sftp.chmod("/root/PORT_MAPPING.md", 0o644)
    sftp.put(f"{LOCAL_DIR}/UNIT.md", "/var/www/shankarawell/UNIT.md")
    sftp.close()
    print("uploaded: /root/PORT_MAPPING.md + /var/www/shankarawell/UNIT.md")

    o, _ = run(cli, "wc -l /root/PORT_MAPPING.md; head -6 /root/PORT_MAPPING.md")
    print(f"[verify PORT_MAPPING.md]\n{o}")
    o, _ = run(cli, "grep -n '3980\\|4080\\|shankarawe' /var/www/shankarawell/UNIT.md | head -8")
    print(f"[verify UNIT.md ports]\n{o}")

    o, _ = run(cli, "cat /root/NEXT-AGENT-PLAN.md")
    print("\n=== /root/NEXT-AGENT-PLAN.md (full) ===\n" + (o if o else "(empty)"))

    cli.close()


if __name__ == "__main__":
    main()

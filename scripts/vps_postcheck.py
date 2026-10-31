#!/usr/bin/env python3
"""Post-migration: 1) confirm local proxy ports 3995/3996 healthy,
2) add missing /etc/hosts entries for ponpes & masjid (pre-existing gap —
tunnel publishes ponpes but /etc/hosts only had a 'pondok' entry),
3) verify shankarawell state, 4) print final port map for PORT_MAPPING.md."""
import paramiko

HOST = "host.zerotier.my.id"
PORT = 2226
USER = "root"
KEY = "/home/z/my-project/.ssh/id_ed25519"


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

    # --- local proxy health for the two flagged siblings ---
    for port, name in ((3995, "masjid"), (3996, "ponpes")):
        o, _ = run(cli, f"curl -sk -o /dev/null -m 8 -w '%{{http_code}}' https://127.0.0.1:{port}/")
        print(f"[local proxy :{port} {name}] HTTP {o}")

    # --- add missing /etc/hosts entries (additive, idempotent) ---
    for dom in ("ponpes.yapsidarussalam.or.id", "masjid.yapsidarussalam.or.id"):
        o, _ = run(cli, f"grep -q '127.0.0.1[[:space:]]{dom}$' /etc/hosts && echo PRESENT || echo MISSING")
        if "MISSING" in o:
            o2, e2 = run(cli, f"echo '127.0.0.1 {dom}' >> /etc/hosts && grep '{dom}' /etc/hosts")
            print(f"[hosts +] {dom} -> {o2 or e2}")
        else:
            print(f"[hosts ok] {dom} already present")

    # --- verify ponpes origin now resolvable locally ---
    o, _ = run(cli, "curl -sk -o /dev/null -m 8 -w '%{http_code}' https://ponpes.yapsidarussalam.or.id:3996/")
    print(f"[origin ponpes :3996 via hostname] HTTP {o}")

    # --- shankarawell final state ---
    o, _ = run(cli, "systemctl is-active yapsi-main; systemctl is-active shankarawell")
    print(f"[services] yapsi-main={o.splitlines()[0] if o else '?'} shankarawell={o.splitlines()[1] if len(o.splitlines())>1 else '?'}")
    o, _ = run(cli, "ss -tlnH | grep -E ':(390[01]|39[6-9][0-9])\\s' | sort -t: -k2 -n")
    print("--- final 39xx listeners ---")
    print(o)
    o, _ = run(cli, "ss -tlnH | grep -E ':(40[0-8][0-9])\\s' | sort -t: -k2 -n")
    print("--- final 40xx loopback listeners ---")
    print(o)
    cli.close()


if __name__ == "__main__":
    main()

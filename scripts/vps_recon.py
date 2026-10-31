#!/usr/bin/env python3
"""Recon the user's VPS: auth via deploy key, inventory runtime, cloudflared
setup, /var/www contents, used ports in 3900-3999, and current public
behavior of the subdomain. Token-safe: long secret-looking strings are
redacted before printing."""
import socket
import sys

import paramiko

HOST = "host.zerotier.my.id"
PORT = 2226
KEY = "/home/z/my-project/.ssh/id_ed25519"
USERS = ["root", "ubuntu", "debian", "admin"]

REDACT = "sed -E 's/[A-Za-z0-9+_/=-]{28,}/<REDACTED>/g'"

CMDS = [
    ("whoami", "whoami && id"),
    ("host", "hostname; uname -a"),
    ("os", "head -2 /etc/os-release"),
    ("node", "command -v node && node -v || echo none"),
    ("bun", "command -v bun && bun --version || echo none"),
    ("caddy", "command -v caddy && caddy version || echo none"),
    ("nginx", "command -v nginx && nginx -v 2>&1 || echo none"),
    ("apache", "command -v apache2 || echo none"),
    ("docker", "command -v docker || echo none"),
    ("python3", "command -v python3 && python3 -V || echo none"),
    ("disk-mem", "df -h / | tail -1; free -m | head -2"),
    ("cloudflared-svc", "systemctl status cloudflared --no-pager 2>/dev/null | head -6 || echo none"),
    ("cloudflared-unit", f"systemctl cat cloudflared 2>/dev/null | grep -E 'ExecStart|User' | {REDACT} || echo none"),
    ("cloudflared-cfg", "cat /etc/cloudflared/config.yml 2>/dev/null || cat /root/.cloudflared/config.yml 2>/dev/null || echo NO_LOCAL_CONFIG"),
    ("cloudflared-dir", "ls -la /etc/cloudflared 2>/dev/null; ls -la /root/.cloudflared 2>/dev/null"),
    ("tunnels-files", "ls /etc/cloudflared/*.json /root/.cloudflared/*.json 2>/dev/null | head"),
    ("www", "ls -la /var/www/ 2>/dev/null; echo ---; du -sh /var/www/* 2>/dev/null | head -20"),
    ("shankarawe", "ls -la /var/www/shankarawe 2>/dev/null | head -30 || echo NOT_EXIST"),
    ("services", "systemctl list-units --type=service --state=running --no-pager | tail -n +2 | awk '{print $1}' | grep -viE 'systemd|dbus|ssh|cron|getty|network|polkit|rsyslog|logind|journal|udev|timesync|unattended|qemu|acpid' | head -25"),
    ("app-procs", f"ps aux | grep -E 'node|bun|server\\.js|next' | grep -v grep | {REDACT} | head -12"),
    ("ports-used", "ss -tlnH 2>/dev/null | awk '{print $4}' | grep -oE '[0-9]+$' | sort -un | tr '\\n' ' '"),
    ("port-range-39xx", "ss -tlnH 2>/dev/null | awk '{print $4}' | grep -oE '39[0-9]{2}$' | sort -un | tr '\\n' ' ' || true"),
    ("ufw", "command -v ufw >/dev/null && ufw status 2>/dev/null | head -10 || echo none"),
    ("public-https", "curl -s -o /dev/null -m 8 -w 'code=%{http_code} redirect=%{redirect_url}\\n' https://shankarawell.yapsidarussalam.or.id/ 2>&1 || echo curl-fail"),
    ("public-http", "curl -s -o /dev/null -m 8 -w 'code=%{http_code} redirect=%{redirect_url}\\n' http://shankarawell.yapsidarussalam.or.id/ 2>&1 || echo curl-fail"),
    ("dns", "getent hosts shankarawell.yapsidarussalam.or.id || echo no-dns"),
]


def connect():
    last_err = None
    for user in USERS:
        cli = paramiko.SSHClient()
        cli.set_missing_host_key_policy(paramiko.AutoAddPolicy())
        try:
            cli.connect(
                hostname=HOST, port=PORT, username=user, key_filename=KEY,
                timeout=20, banner_timeout=20, auth_timeout=20,
                allow_agent=False, look_for_keys=False,
            )
            return cli, user
        except paramiko.AuthenticationException:
            last_err = "auth-failed"
            print(f"[auth] {user}: authentication failed")
        except Exception as e:
            last_err = f"{type(e).__name__}: {e}"
            print(f"[auth] {user}: {last_err}")
        try:
            cli.close()
        except Exception:
            pass
    print(f"ALL_USERS_FAILED ({last_err})")
    sys.exit(3)


def main():
    try:
        ip = socket.gethostbyname(HOST)
        print(f"[dns] {HOST} -> {ip}")
    except Exception as e:
        print(f"[dns] resolve failed: {e}")
    cli, user = connect()
    print(f"[auth] OK as '{user}@{HOST}:{PORT}'")
    for label, cmd in CMDS:
        try:
            _, out, err = cli.exec_command(cmd, timeout=25)
            text = out.read().decode(errors="replace").strip()
            etext = err.read().decode(errors="replace").strip()
            print(f"\n=== {label} ===\n{text}" + (f"\n[stderr] {etext}" if etext and not text else ""))
        except Exception as e:
            print(f"\n=== {label} === ERROR {type(e).__name__}: {e}")
    cli.close()


if __name__ == "__main__":
    main()

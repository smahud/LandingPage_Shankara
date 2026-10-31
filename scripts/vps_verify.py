#!/usr/bin/env python3
"""Post-deploy verification: middleware https-only behavior + full content
delivery through the proxy chain."""
import paramiko

HOST = "host.zerotier.my.id"
PORT = 2226
KEY = "/home/z/my-project/.ssh/id_ed25519"
DOMAIN = "shankarawell.yapsidarussalam.or.id"

CMDS = [
    ("mw-redirect", f"curl -s -o /dev/null -m 8 -w 'code=%{{http_code}} loc=%{{redirect_url}}' -H 'Host: {DOMAIN}' -H 'cf-visitor: {{\"scheme\":\"http\"}}' http://127.0.0.1:4008/"),
    ("mw-https-pass", f"curl -s -o /dev/null -m 8 -w 'code=%{{http_code}}' -H 'Host: {DOMAIN}' -H 'cf-visitor: {{\"scheme\":\"https\"}}' http://127.0.0.1:4008/"),
    ("mw-noheader-pass", "curl -s -o /dev/null -m 8 -w 'code=%{http_code}' http://127.0.0.1:4008/"),
    ("proxy-static-asset", f"curl -s -o /dev/null -m 8 -w 'code=%{{http_code}} type=%{{content_type}}' https://{DOMAIN}:3998/images/logo-lotus.png"),
    ("proxy-next-chunk", f"curl -s -o /dev/null -m 8 -w 'code=%{{http_code}}' `curl -s {DOMAIN}x 2>/dev/null >/dev/null; true` -L https://{DOMAIN}:3998/ | grep -oE '/_next/static/chunks/[^\"]+\\.js' | head -1 | sed 's|^|https://{DOMAIN}:3998|'"),
    ("proxy-robots", f"curl -s -m 8 https://{DOMAIN}:3998/robots.txt | head -3"),
    ("proxy-security-headers", f"curl -sI -m 8 https://{DOMAIN}:3998/ | grep -iE 'strict-transport|x-content-type|x-frame|referrer-policy' "),
    ("hsts-check", f"curl -sI -m 8 https://{DOMAIN}:3998/ | grep -i strict-transport"),
    ("public-now", f"curl -s -o /dev/null -m 8 -w 'code=%{{http_code}}' https://{DOMAIN}/ 2>&1"),
]


def main():
    cli = paramiko.SSHClient()
    cli.set_missing_host_key_policy(paramiko.AutoAddPolicy())
    cli.connect(hostname=HOST, port=PORT, username="root", key_filename=KEY,
                timeout=20, allow_agent=False, look_for_keys=False)
    for label, cmd in CMDS:
        _, out, err = cli.exec_command(cmd, timeout=30)
        text = out.read().decode(errors="replace").strip()
        print(f"=== {label} ===\n{text}\n")
    cli.close()


if __name__ == "__main__":
    main()

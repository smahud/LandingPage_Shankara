#!/usr/bin/env python3
"""VPS-side LCP diagnostics for shankarawell: compression, proxy, cache headers."""
import paramiko

HOST, PORT, USER, KEY = "host.zerotier.my.id", 2226, "root", "/home/z/my-project/.ssh/id_ed25519"
DOM = "shankarawell.yapsidarussalam.or.id"

cli = paramiko.SSHClient()
cli.set_missing_host_key_policy(paramiko.AutoAddPolicy())
cli.connect(hostname=HOST, port=PORT, username=USER, key_filename=KEY,
            timeout=20, allow_agent=False, look_for_keys=False)


def run(label, cmd, timeout=30):
    _, out, err = cli.exec_command(cmd, timeout=timeout)
    o = out.read().decode(errors="replace").strip()
    e = err.read().decode(errors="replace").strip()
    print(f"### {label}\n{o}" + (f"\n[err] {e}" if e else "") + "\n")


run("VPS location", "curl -s -m 8 https://ipinfo.io/json 2>/dev/null | head -20 || curl -s -m 8 ifconfig.me")
run("what is on :3980", "ss -tlnp | grep -E ':(3980|4080)\\b'; echo '---'; (command -v caddy && caddy version) 2>/dev/null; (command -v nginx && nginx -v) 2>&1 | head -1; ps aux | grep -E 'caddy|nginx' | grep -v grep | head -5")
run("caddy/nginx config for 3980", "grep -rn '3980' /etc/caddy/ /etc/nginx/ 2>/dev/null | head -20")
run("cloudflared", "systemctl is-active cloudflared 2>/dev/null; ps aux | grep cloudflared | grep -v grep | head -3 | cut -c1-200")
run("ORIGIN compression app:4080 (gzip)",
    "curl -s -D - -o /dev/null -m 8 -H 'Accept-Encoding: gzip, br' http://127.0.0.1:4080/ | grep -iE 'content-encoding|content-length|cache-control|HTTP/'")
run("ORIGIN compression app:4080 (size)",
    "curl -s -m 8 -H 'Accept-Encoding: gzip' -o /dev/null -w 'gz=%{size_download}B t=%{time_total}s\\n' http://127.0.0.1:4080/; curl -s -m 8 -o /dev/null -w 'raw=%{size_download}B t=%{time_total}s\\n' http://127.0.0.1:4080/")
run("PROXY :3980 compression",
    f"curl -sk -D - -o /dev/null -m 8 -H 'Accept-Encoding: gzip, br' https://{DOM}:3980/ | grep -iE 'content-encoding|content-length|cache-control|HTTP/'")
run("PROXY :3980 size",
    f"curl -sk -m 8 -H 'Accept-Encoding: gzip' -o /dev/null -w 'gz=%{{size_download}}B t=%{{time_total}}s\\n' https://{DOM}:3980/; curl -sk -m 8 -o /dev/null -w 'raw=%{{size_download}}B t=%{{time_total}}s\\n' https://{DOM}:3980/")
run("CSS asset via proxy",
    f"CH=$(curl -sk -m 10 https://{DOM}:3980/ | grep -oE '/_next/static/[^\\\"]+\\.css' | head -1); echo css=$CH; curl -sk -m 8 -H 'Accept-Encoding: gzip' -o /dev/null -w 'raw=%{{size_download}}B ' https://{DOM}:3980$CH; curl -sk -m 8 -o /dev/null -w 'ungz=%{{size_download}}B t=%{{time_total}}s\\n' https://{DOM}:3980$CH; curl -sk -D - -o /dev/null -m 8 https://{DOM}:3980$CH | grep -iE 'cache-control|content-encoding'")
run("hero image via proxy",
    f"curl -sk -o /dev/null -m 8 -w 'img=%{{size_download}}B t=%{{time_total}}s\\n' https://{DOM}:3980/images/hero-yoga.webp; curl -sk -I -m 8 https://{DOM}:3980/images/hero-yoga.webp | grep -iE 'cache-control|content-type'")
run("fonts sizes", "ls -la /var/www/shankarawell/standalone/.next/static/media/*.woff2 2>/dev/null | head -8")
run("node CPU count", "nproc; free -m | head -2")
run("PORT_MAPPING exists", "ls -la /root/PORT_MAPPING.md 2>/dev/null && head -30 /root/PORT_MAPPING.md")
cli.close()
print("done")

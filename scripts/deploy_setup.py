#!/usr/bin/env python3
"""Generate an ed25519 OpenSSH deploy keypair for the Shankara site
and test outbound SSH connectivity from this sandbox.

- Private key : /home/z/my-project/.ssh/id_ed25519  (chmod 600, never printed)
- Public key   : /home/z/my-project/.ssh/id_ed25519.pub (safe to share)
- Public copy  : /home/z/my-project/download/id_ed25519_deploy.pub.txt
Idempotent: an existing key is reused, never overwritten.
"""
import base64
import hashlib
import os
import socket
import sys
from pathlib import Path

from cryptography.hazmat.primitives import serialization
from cryptography.hazmat.primitives.asymmetric.ed25519 import Ed25519PrivateKey

SSH_DIR = Path("/home/z/my-project/.ssh")
PRIV = SSH_DIR / "id_ed25519"
PUB = SSH_DIR / "id_ed25519.pub"
DL_PUB = Path("/home/z/my-project/download/id_ed25519_deploy.pub.txt")
COMMENT = "zai-sandbox-shankara-deploy"


def generate_or_load():
    SSH_DIR.mkdir(mode=0o700, parents=True, exist_ok=True)
    os.chmod(SSH_DIR, 0o700)

    if PRIV.exists() and PUB.exists():
        print("[key] existing key found, reusing (not regenerated)")
        return

    key = Ed25519PrivateKey.generate()
    priv_pem = key.private_bytes(
        encoding=serialization.Encoding.PEM,
        format=serialization.PrivateFormat.OpenSSH,
        encryption_algorithm=serialization.NoEncryption(),
    )
    PRIV.write_bytes(priv_pem)
    os.chmod(PRIV, 0o600)

    pub_line = (
        key.public_key().public_bytes(
            encoding=serialization.Encoding.OpenSSH,
            format=serialization.PublicFormat.OpenSSH,
        )
        + b" "
        + COMMENT.encode()
    )
    PUB.write_bytes(pub_line)
    os.chmod(PUB, 0o644)
    print("[key] new ed25519 keypair generated")


def main():
    generate_or_load()

    pub_line = PUB.read_bytes().strip()
    DL_PUB.parent.mkdir(parents=True, exist_ok=True)
    DL_PUB.write_bytes(pub_line + b"\n")

    blob_b64 = pub_line.split()[1]
    fp = base64.b64encode(
        hashlib.sha256(base64.b64decode(blob_b64)).digest()
    ).decode().rstrip("=")

    print("=== PUBLIC KEY (safe to share) ===")
    print(pub_line.decode())
    print("=== FINGERPRINT ===")
    print("SHA256:" + fp)
    print("=== FILES ===")
    print(f"private : {PRIV} (mode 600, kept secret)")
    print(f"public  : {PUB}")
    print(f"copy    : {DL_PUB}")

    print("=== OUTBOUND SSH CONNECTIVITY ===")
    targets = [("github.com", 22), ("ssh.github.com", 443)]
    reachable = False
    for host, port in targets:
        try:
            s = socket.create_connection((host, port), timeout=8)
            s.settimeout(5)
            try:
                banner = s.recv(64).decode(errors="replace").strip()
            except Exception:
                banner = "(no banner)"
            print(f"{host}:{port} -> OPEN ({banner})")
            s.close()
            reachable = True
        except Exception as e:
            print(f"{host}:{port} -> BLOCKED/FAIL ({e})")
    if not reachable:
        print("WARNING: outbound SSH seems blocked; deployment may need a fallback.")
        sys.exit(2)


if __name__ == "__main__":
    main()

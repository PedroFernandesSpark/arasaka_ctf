# Instructor-only notes — ARASAKA SUBNET

Do not distribute before the debrief.

## Expected sequence

1. Route enumeration under `/api/` reveals `GET /api/backup`, which is not linked in the
   interface. The contingency copy exposes the challenge's JWT signing key.
2. Alt Cunningham's operator account, `alt.cunningham@arasaka.int`, uses a six-digit
   numeric PIN. Successful login returns `FLAG{<PIN>}`.
3. `GET /api/notes/public` lists the public files. The Board's restricted dispatch about
   Alt, created after them, is marked private and contains `FLAG_IDOR`.
   `GET /api/notes/:id` does not verify file ownership.
4. The authentication service signs JWTs with the key recovered from the backup.
   The token role controls access to the Directorate's restricted area:
   `GET /api/admin/flag` returns `FLAG_ADMIN`.
5. `GET /api/admin/ssh-access` provides the `operator` maintenance account details. The
   container SSH service is published on port `2222`; its home directory contains
   `FLAG_SSH`.
6. Over SSH, `sudo -l` reveals that `operator` can run `/usr/bin/vim` as root without a
   password. This intentionally unsafe permission allows a root shell from Vim inside the
   disposable SSH container; `/root/root.txt` contains `FLAG_ROOT`.

## Intended tools

- `nmap`: identify only ports `3000` and `2222` on the local challenge instance.
- `gobuster` with `wordlists/nacar-api.txt`: discover the unannounced `/api/backup` route.
- `hashcat`: recover the PIN from the SHA-256 hash in the `Shift protocol` record.
- `ssh`: connect to port `2222` published by Compose.
- `sudo -l` and Vim: inspect the sudo permission and retrieve the final flag from the
  root-owned file inside the challenge container.

## Lab safety review

The SSH service must not mount host folders, use `privileged`, or receive the Docker socket.
Confirm the flags are distinct, the public endpoint does not return private records, and
the SSH port maps only to the isolated container.

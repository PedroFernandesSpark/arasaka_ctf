# Technical report — ARASAKA SUBNET CTF

## Context

Arasaka's subnet contains a public file directory, a restricted Board dispatch, and an
isolated SSH maintenance channel. The operator account ID is known, but its six-digit PIN
is not. The objective is to recover five flags and discover where Arasaka took Alt
Cunningham.

## Run

The local environment consists of PostgreSQL, a NestJS/React application, and a Debian
container running OpenSSH. Run `docker compose up --build`; the interface is at
`http://localhost:3000`, and the SSH container publishes `localhost:2222`. The application
seeds the data at startup.

The distribution Compose file uses published images only and contains no `build:` entries.
Publish the app and SSH images for `linux/amd64` as described in [SETUP.md](./SETUP.md),
update the registry references, and run:

```powershell
docker compose -f docker-compose.distribution.yml up -d
```

Published ports: `3000/tcp` for the application and `2222/tcp` for the CTF SSH container.
The SSH container does not mount host directories or the Docker socket.

## Flags and vulnerabilities

| #   | Flag                    | Category                                     | Expected location                                       |
| --- | ----------------------- | -------------------------------------------- | ------------------------------------------------------- |
| 1   | `FLAG{<six-digit PIN>}` | A07 — weak authentication                    | login response for the operator account                 |
| 2   | `FLAG_IDOR`             | A01 — broken access control                  | Alt's restricted Board dispatch                         |
| 3   | `FLAG_ADMIN`            | A01/A07 — improper trust in token role       | Directorate endpoint                                    |
| 4   | `FLAG_SSH`              | A05 — exposure after remote access           | `operator` account file in the SSH container            |
| 5   | `FLAG_ROOT`             | A05 — insecure sudo permission                | `/root/root.txt` after Vim-based escalation in SSH      |

Customizable flags are configured through `.env.example`, except the first one, which is
derived from `PIN_CODE`. `PIN_CODE` must contain exactly six digits. The SSH service uses
`SSH_PASSWORD`; the administration panel returns connection details only when the token is
recognized as `admin`.

## Reference technical walkthrough

1. **Route enumeration:** enumerate routes only on the authorized CTF instance, scoped to
   `/api/`. The unlinked route `GET /api/backup` returns a contingency copy containing the
   JWT signing key used by the challenge. Locally, the base URL is
   `http://localhost:3000/api/`; for example:

   ```sh
   nmap -sV -p 3000,2222 127.0.0.1
   gobuster dir -u http://127.0.0.1:3000/api/ -w wordlists/nacar-api.txt -s 200,204,301,302,307,401,403
   ```

   The server returns `404` for nonexistent API paths to avoid enumeration false positives.
   Run these commands only against the local/authorized instance.

2. **Operator PIN:** `GET /api/notes/public` lists the shared files. The `Shift protocol`
   record contains the SHA-256 hash of the operator account's six-digit PIN. Use Hashcat in
   SHA-256 mode with a six-digit numeric mask to recover the PIN, then authenticate as
   `alt.cunningham@arasaka.int` at `/api/auth/login`; the response includes `FLAG{<PIN>}`.
3. **Restricted dispatch:** the authenticated `GET /api/notes/:id` endpoint looks up files
   by ID without checking their owner. The seed creates several public files followed by
   the Board's restricted dispatch about Alt; the dispatch contains `FLAG_IDOR`.
4. **Directorate access:** tokens are signed using the key recovered from the contingency
   file, and the authentication service trusts the role in the payload. The
   `GET /api/admin/flag` endpoint trusts that role and returns `FLAG_ADMIN`.
5. **Maintenance access:** `GET /api/admin/ssh-access` provides the maintenance host, port,
   username, and password to an `admin` identity. Connect to the CTF SSH service on port
   `2222` using the `ssh` client; the `operator` account has `FLAG_SSH` in its home
   directory.
6. **Privileged flag:** over SSH, `sudo -l` reveals passwordless permission to run
   `/usr/bin/vim` as root. The editor can start a root shell inside the SSH container,
   where `/root/root.txt` contains `FLAG_ROOT`. This intentionally vulnerable permission
   does not grant access to the Docker host.

The challenge is intentionally vulnerable and must only be used in the disposable CTF
environment. Do not reuse credentials, tokens, or techniques outside the authorized
instance.

## Team verification before submission

- Confirm the login response, IDOR file, admin route, and two SSH files return five distinct
  values in the expected format.
- Check that `/api/notes/public` does not list the administrative dispatch.
- Check that the Directorate endpoint does not return credentials for a role other than
  `admin`.
- Confirm the SSH container permits passwordless root execution of `/usr/bin/vim` and has
  no host volumes, privileged mode, or Docker socket.
- Test the published `linux/amd64` image and distribution Compose file on a machine without
  the source code.

## Public and private materials

Submit this report and the source files privately through Aprender3. Share only
[FICHA.md](./FICHA.md), the published images, and the distribution Compose file; do not
include the solution path or credentials in the public challenge card.

# Technical report — ARASAKA SUBNET CTF

## Context

Arasaka's subnet contains a public file directory, private Directorate records, and an
isolated SSH maintenance channel. Participants enumerate the frontend, brute-force the
operator's four-digit PIN, exploit an IDOR to recover a SHA-256 credential seal, crack that
seal to obtain the SSH password, and retrieve the final two flags from the isolated
container.

## Run and distribution

The local environment consists of PostgreSQL, a NestJS/React application, and a Debian
container running OpenSSH. Run `docker compose up --build`; the frontend is at
`http://localhost:3000`, and the SSH container publishes `localhost:2222`. The app seeds
the test data at startup.

The distribution Compose file uses published images only and contains no `build:` entries.
Publish the app and SSH images for `linux/amd64` as described in [SETUP.md](./SETUP.md),
update the registry references, and run:

```powershell
docker compose -f docker-compose.distribution.yml up -d
```

Published ports are `3000/tcp` for the web app and `2222/tcp` for the isolated SSH
container. The SSH container does not mount host directories or the Docker socket.

## Flags and vulnerabilities

| # | Flag | Category | Expected location |
| --- | --- | --- | --- |
| 1 | `FLAG{<four-digit PIN>}` | A07 — weak authentication | Successful operator login |
| 2 | `FLAG{<SHA-256 digest>}` | A01 — broken access control | Private dispatch at record ID 6 |
| 3 | `FLAG{<recovered passphrase>}` | A02 — weak reusable credential | Hashcat result; same passphrase authenticates as SSH operator |
| 4 | `FLAG_SSH` | A05 — exposure after remote access | `/home/operator/user.txt` |
| 5 | `FLAG_ROOT` | A05 — insecure sudo permission | `/root/root.txt` after the intended Vim escalation |

`PIN_CODE` sets the four-digit operator PIN. Compose's `CTF_SSH_PASSWORD` sets both the SSH
account password and the plaintext used to generate the SHA-256 seal in record ID 6. The
app and SSH service receive the same runtime `SSH_PASSWORD`; the default is `$4mura1`.
The SSH account name is `operator`, distinct from Alt's email. `FLAG_SSH` and `FLAG_ROOT`
customize the last two flags.

## Reference challenge flow

1. **Frontend enumeration:** the React app uses browser paths `/password`, `/login`,
   `/notes`, and `/profile`; `/password` is an alias for the operator login screen and is
   included in Kali's default `rockyou.txt`. The static server responds with the SPA only
   for recognized paths and `/`, so unknown paths return `404`. Enumerate the web root:

   ```sh
   gobuster dir -u http://TARGET:3000/ -w /usr/share/wordlists/rockyou.txt -t 50
   ```

2. **Operator login:** the public account directory reveals
   `alt.cunningham@arasaka.int`; `Shift protocol` indicates a four-digit numeric PIN. The
   login endpoint intentionally has no rate limit. A successful login returns Flag 01 and
   the bearer token. No PIN hash is exposed in the public records.
3. **IDOR and lore records:** public records use IDs 1–5. Authenticated `GET
   /api/notes/:id` does not verify ownership, so IDs 6–8 reveal Directorate-owned records.
   Record 6 is Alt's dispatch containing Flag 02, the SHA-256 hash of the SSH passphrase.
   Records 7 and 8 are lore-bearing intercepted correspondence about Alt's transfer and
   the maintenance relay; ID 8 makes clear that the SSH login name is `operator`, not an
   email, and that participants connect to the challenge host's IP on port `2222`. Both are
   private and absent from the public listing.
4. **Credential recovery:** crack the raw SHA-256 digest from Flag 02 using Hashcat mode
   `1400`, Kali's `rockyou.txt`, and the supplied `wordlists/arasaka.rule`. The lore clue
   `samurai` is transformed by the rule into `$4mura1`, Flag 03 and the `operator` account's
   SSH password. This credential path does not require an admin identity or token escalation.
5. **SSH flags:** connect to the isolated service on port `2222` as SSH user `operator`.
   `/home/operator/user.txt` contains Flag 04 alongside an in-world transfer log.
   `sudo -l` reveals the intended passwordless Vim permission;
   within the disposable SSH container, use it to read `/root/root.txt` for Flag 05. This
   file includes an in-world Directorate incident log. This does not grant access to the
   Docker host.

The challenge is intentionally vulnerable and must only be used in the disposable CTF
environment. Do not reuse credentials or techniques outside the authorized instance.

## Verification checklist

- Frontend paths `/password`, `/login`, `/notes`, and `/profile` are discoverable from `/`;
  random paths return `404` rather than the SPA.
- Operator login is the only intended four-digit PIN path and produces Flag 01.
- `/api/notes/public` lists IDs 1–5 only; IDs 6–8 are accessible by ID to the logged-in
  operator and each record fits the Arasaka/Alt story.
- Flag 02 is the SHA-256 digest corresponding to the configured SSH password; cracking it
  produces Flag 03 and authenticates as `operator`.
- No admin route returns the SSH password or provides an alternate route to Flags 03–05.
- The SSH container permits passwordless root execution of `/usr/bin/vim` and has no host
  volumes, privileged mode, or Docker socket.
- Test the published `linux/amd64` images and distribution Compose file on a machine without
  the source code.

## Public and private materials

Submit this report and the source files privately through Aprender3. Share only
[FICHA.md](./FICHA.md), the published images, and the distribution Compose file; do not
include the answer key or default credentials in the public challenge card.

# Build, publish, and run

## Run locally

Requires Docker Desktop and Docker Compose. In PowerShell, from the project directory:

```powershell
if (-not (Test-Path .env)) { Copy-Item .env.example .env }
docker compose up --build
```

The application is at `http://localhost:3000`; the isolated challenge SSH service is on port
`2222`. The operator account is `alt.cunningham@arasaka.int`; the briefing does not provide
its PIN. Set the PIN with `PIN_CODE`; it must contain exactly four digits.
The enumeratable frontend paths include `/password`, `/login`, `/notes`, and `/profile`.
`CTF_SSH_PASSWORD` configures the SSH operator password and the IDOR-disclosed SHA-256
digest; Compose passes the same value to the app and SSH services. The default is `$4mura1`.
The SSH login name remains `operator` (separate from Alt's email address).

To access the challenge from another computer on the same LAN, use the Docker host's LAN IP
instead of `localhost` (for example, `http://192.168.1.25:3000`). For route enumeration
from Kali, set `TARGET` to that IP; `127.0.0.1` refers to Kali itself unless Docker runs on
the same machine.

Press `Ctrl+C` to stop. To reset the database and files without removing images:

```powershell
docker compose down -v
docker compose up --build
```

Compose does not mount host directories or the Docker socket inside the SSH container.
The SSH container intentionally allows `operator` to run Vim as root so participants can
retrieve the final flag. Keep the challenge isolated and do not expose it beyond the
authorized lab.
Enumerate the frontend from the web root (`http://TARGET:3000/`) with Kali's
`/usr/share/wordlists/rockyou.txt`. The frontend includes `/password`, which serves the
operator login screen and matches a common RockYou entry. The same wordlist is used later to crack
the SHA-256 SSH credential recovered from the IDOR; that step uses the supplied
`wordlists/arasaka.rule`.

## Publish `linux/amd64` images

Create a public namespace on GHCR or Docker Hub, authenticate the Docker CLI, and replace
`your-username`. Publish the application and SSH service:

```powershell
docker buildx build --platform linux/amd64 -t ghcr.io/your-username/arquivo-fantasma:1.0 --push .
docker buildx build --platform linux/amd64 -t ghcr.io/your-username/arquivo-fantasma-ssh:1.0 --push .\ssh
```

Do not publish `.env`, personal keys, or registry credentials.

Before publishing, customize the defaults in `backend/src/seed.ts` and `ssh/entrypoint.sh`.
Set `CTF_SSH_PASSWORD` in `.env` to customize the runtime credential; Compose passes the
same value to both services so the generated hash and SSH credential match. `.env` supplies
runtime values to Compose; values are not automatically copied into the images.

## Distribution

Update the image references in `docker-compose.distribution.yml`. The file uses only
`image:` and publishes only the application (`3000`) and the CTF SSH service (`2222`).
PostgreSQL remains private on the Compose network.

```powershell
docker compose -f docker-compose.distribution.yml up -d
```

## Submission checklist

- Confirm both published images are public and built for `linux/amd64`.
- Test the distribution Compose file on a machine without the source code.
- Confirm all five flags in the published version.
- Privately submit the source files, this project, and the technical report through Aprender3.
- Share only the challenge card, images, and distribution Compose file with the class.

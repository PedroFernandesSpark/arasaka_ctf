# Build, publish, and run

## Run locally

Requires Docker Desktop and Docker Compose. In PowerShell, from the project directory:

```powershell
if (-not (Test-Path .env)) { Copy-Item .env.example .env }
docker compose up --build
```

The application is at `http://localhost:3000`; the isolated challenge SSH service is on port
`2222`. The operator account is `alt.cunningham@arasaka.int`; the briefing does not provide
its PIN. Set the PIN with `PIN_CODE`; it must contain exactly six digits.

Press `Ctrl+C` to stop. To reset the database and files without removing images:

```powershell
docker compose down -v
docker compose up --build
```

Compose does not mount host directories or the Docker socket inside the SSH container.
The SSH container intentionally allows `operator` to run Vim as root so participants can
retrieve the final flag. Keep the challenge isolated and do not expose it beyond the
authorized lab.
If participants will not receive the source code, provide `wordlists/nacar-api.txt`
separately for the route-enumeration stage; the wordlist does not need to be included in
the images.

## Publish `linux/amd64` images

Create a public namespace on GHCR or Docker Hub, authenticate the Docker CLI, and replace
`your-username`. Publish the application and SSH service:

```powershell
docker buildx build --platform linux/amd64 -t ghcr.io/your-username/arquivo-fantasma:1.0 --push .
docker buildx build --platform linux/amd64 -t ghcr.io/your-username/arquivo-fantasma-ssh:1.0 --push .\ssh
```

Do not publish `.env`, personal keys, or registry credentials.

Before publishing, customize the defaults in `backend/src/seed.ts`,
`backend/src/admin/admin.controller.ts`, and `ssh/entrypoint.sh`. `.env` is used by the
development Compose file; its values are not automatically copied into the images.

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

# ARASAKA SUBNET — Cyberpunk CTF

Arasaka's subnet is bleeding public files, a restricted Board dispatch, and a remote
maintenance channel. You have the operator account ID, but not its six-digit PIN. Recover
five flags and find out where Arasaka took Alt Cunningham.

This project is an isolated academic lab with five flags in the `FLAG{...}` format.
Do not expose it to a public network outside the agreed scope.

## Run locally

Requires Docker Desktop with Docker Compose. The challenge exposes the application on port
`3000` and the SSH container on port `2222`.

```powershell
if (-not (Test-Path .env)) { Copy-Item .env.example .env }
docker compose up --build
```

Open `http://localhost:3000`. The operator account is
`alt.cunningham@arasaka.int`; finding its PIN is the first challenge objective.

## Materials

- [SETUP.md](./SETUP.md): `linux/amd64` builds, publishing, and distribution setup.
- [EXERCISE.md](./EXERCISE.md): spoiler-free participant briefing.
- [FICHA.md](./FICHA.md): public challenge card.
- [RELATORIO.md](./RELATORIO.md): context, setup, flag map, and verification.
- [FACILITATOR.md](./FACILITATOR.md): notes reserved for instructors.
- [GABARITO.md](./GABARITO.md): full solution, credentials, and default flags — keep private.
- [SUBMISSAO.md](./SUBMISSAO.md): evidence submission form.

`docker-compose.yml` builds the development containers. Distribution uses
`docker-compose.distribution.yml`, which contains only `image:` references and does not
build images locally.

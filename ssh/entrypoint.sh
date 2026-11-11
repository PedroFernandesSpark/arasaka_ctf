#!/bin/sh
set -eu

: "${SSH_PASSWORD:=\$4mura1}"
: "${FLAG_SSH:=FLAG{cunningham_signal_recovered}}"
: "${FLAG_ROOT:=FLAG{black_wall_root_backup}}"

ssh-keygen -A
printf '%s:%s\n' operator "${SSH_PASSWORD}" | chpasswd
cat > /home/operator/user.txt <<EOF
ARASAKA INTERNAL // CONTRACTOR RELAY 09
FILE: SHIFT HANDOFF / OPERATOR HOME
CLASSIFICATION: recovered from maintenance container

The account name for this shell is operator. It is a local Unix user on the isolated relay,
not an email address and not part of the host IP. The relay accepts connections on SSH port
2222. This account has no Directorate privileges and cannot cross the container boundary.

SHIFT LOG // 04:17
The cargo elevator lights went dark twice. A signal fragment from Alt Cunningham's
transfer manifest survived the cleanup sweep. Directorate teams moved her to Anel Baixo,
containment module 12, station N-09. The Board ordered the location erased from every
public index, but the maintenance relay kept this copy.

The fragment recovered from this operator's home directory is:
${FLAG_SSH}

If this file reached you, the relay is still listening. Leave no trace in the public archive.
EOF
cat > /root/root.txt <<EOF
ARASAKA INTERNAL // ROOT-OWNED INCIDENT LOG
FILE: BLACK WALL CONTAINMENT / RECOVERY 09
CLASSIFICATION: directorate root archive

The operator account was provisioned for a single maintenance shift. Its sudo policy was
never meant to expose this directory. The Board's incident report says the transfer
records were purged, but the recovery image preserved one final fragment.

INCIDENT SUMMARY
04:11 — N-09 cargo lift isolated.
04:17 — containment module 12 confirmed occupied.
04:23 — archive scrub initiated by Internal Security.
04:31 — scrub completed; one root-owned recovery artifact remains.

Recovered final fragment:
${FLAG_ROOT}

End of record. This file is inside the disposable challenge container; it is not a host
system file.
EOF
chown operator:operator /home/operator/user.txt
chmod 0640 /home/operator/user.txt
chmod 0600 /root/root.txt
printf '%s\n' 'operator ALL=(root) NOPASSWD: /usr/bin/vim' \
  > /etc/sudoers.d/operator-vim
chmod 0440 /etc/sudoers.d/operator-vim
visudo -cf /etc/sudoers.d/operator-vim

cat > /etc/ssh/sshd_config.d/ctf.conf <<'EOF'
Port 22
PasswordAuthentication yes
PermitRootLogin no
AllowUsers operator
EOF

exec /usr/sbin/sshd -D -e

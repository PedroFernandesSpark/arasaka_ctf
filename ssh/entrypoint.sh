#!/bin/sh
set -eu

: "${SSH_PASSWORD:=ArasakaArchive09}"
: "${FLAG_SSH:=FLAG{cunningham_signal_recovered}}"
: "${FLAG_ROOT:=FLAG{black_wall_root_backup}}"

ssh-keygen -A
printf '%s:%s\n' operator "${SSH_PASSWORD}" | chpasswd
printf '%s\n' "${FLAG_SSH}" > /home/operator/user.txt
printf '%s\n' "${FLAG_ROOT}" > /root/root.txt
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

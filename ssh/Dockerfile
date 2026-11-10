FROM debian:bookworm-slim

RUN apt-get update \
    && DEBIAN_FRONTEND=noninteractive apt-get install -y --no-install-recommends openssh-server sudo vim \
    && rm -rf /var/lib/apt/lists/* \
    && useradd --create-home --shell /bin/bash --gid operator operator \
    && mkdir -p /run/sshd /root

COPY entrypoint.sh /usr/local/bin/ctf-entrypoint
RUN chmod 0755 /usr/local/bin/ctf-entrypoint

EXPOSE 22
ENTRYPOINT ["/usr/local/bin/ctf-entrypoint"]

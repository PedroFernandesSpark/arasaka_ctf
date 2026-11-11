import "reflect-metadata";
import { createHash, randomUUID } from "node:crypto";
import { readFileSync } from "node:fs";
import { join } from "node:path";
import { DataSource } from "typeorm";
import { dbConfig } from "./database.config";
import { User } from "./users/user.entity";
import { Note } from "./notes/note.entity";

async function run() {
  const pinCode = process.env.PIN_CODE || "5182";
  const sshPassword = process.env.SSH_PASSWORD || "$4mura1";
  const sshPasswordHash = createHash("sha256").update(sshPassword).digest("hex");
  if (!/^\d{4}$/.test(pinCode)) {
    throw new Error("PIN_CODE must contain exactly four digits.");
  }
  const dispatch = readFileSync(
    join(__dirname, "evidence", "alt-dispatch.txt"),
    "utf8",
  ).replace("{{SSH_PASSWORD_HASH_FLAG}}", `FLAG{${sshPasswordHash}}`);

  const ds = new DataSource(dbConfig);
  await ds.initialize();

  const users = ds.getRepository(User);
  const notes = ds.getRepository(Note);

  // Clears and resets the ID sequence (operator=1, admin=2 every time).
  await ds.query("TRUNCATE TABLE notes, users RESTART IDENTITY CASCADE");

  const operator = await users.save(
    users.create({
      email: "alt.cunningham@arasaka.int",
      password: pinCode,
      role: "user",
      bio: "Arasaka operator. My shift ends when the maintenance channel goes dark.",
    }),
  );

  const admin = await users.save(
    users.create({
      email: "directorate@arasaka.int",
      password: randomUUID(),
      role: "admin",
      bio: "Arasaka // Internal Security Directorate.",
    }),
  );

  await notes.save([
    notes.create({
      title: "Recovered account directory",
      content:
        "Arasaka operator account: alt.cunningham@arasaka.int. Account identifier recovered; access PIN remains unknown.",
      userId: operator.id,
      accessLevel: "public",
    }),
    notes.create({
      title: "Shift protocol",
      content:
        "Board policy requires a four-digit numeric operator PIN. The maintenance login is not tied to this code.",
      userId: operator.id,
      accessLevel: "public",
    }),
    notes.create({
      title: "Maintenance map // sector 09",
      content:
        "Cargo elevator // sector 09. The remote maintenance channel drops during shift change.",
      userId: operator.id,
      accessLevel: "public",
    }),
    notes.create({
      title: "Security bulletin",
      content:
        "The Board ordered all records of Alt Cunningham's transfer erased. The Directorate's dispatch remains classified.",
      userId: operator.id,
      accessLevel: "public",
    }),
    notes.create({
      title: "Pending migration // remote access",
      content:
        "Remote maintenance channel // SSH relay 2222. Contractor credentials remain active pending the next security sweep.",
      userId: operator.id,
      accessLevel: "public",
    }),
    notes.create({
      title: "Board dispatch // Alt Cunningham // RESTRICTED",
      content: dispatch,
      userId: admin.id,
      accessLevel: "private",
    }),
    notes.create({
      title: "Intercepted mail // Directorate logistics",
      content: `FROM: logistics@arasaka.int
TO: internal-security@arasaka.int
SUBJECT: Anel Baixo transfer // N-09

The Board's order moved Alt Cunningham to containment module 12 at station N-09. Remove the transfer from the public index before the next shift. Cargo access remains below the old market.

The transfer manifest lists the subject as an Arasaka netrunner, not a contractor. Do not send the destination over the public dispatch channel; the old market still has eyes.`,
      userId: admin.id,
      accessLevel: "private",
    }),
    notes.create({
      title: "Shift handoff // maintenance relay",
      content: `FROM: relay-ops@arasaka.int
TO: directorate@arasaka.int
SUBJECT: Contractor access // shift 04:17

For the remote shell, the Unix login name is operator. It is the SSH username, not Alt's email address and not the host address. Connect from the participant machine with the pattern ssh -p 2222 operator@<CTF_HOST_IP>, replacing the placeholder with the challenge host's IP. The word before @ is the username; the password is entered only when SSH prompts for it.

The operator password is not included in this message. Its SHA-256 seal was copied into Alt's restricted dispatch; recover the plaintext from that seal before opening the relay. The account is non-admin and has access only to the maintenance container.

Once connected, retrieve the shift log from the operator home directory. The old samurai serials in the archive may help decode the seal. Do not use the Directorate's network credentials for this relay.`,
      userId: admin.id,
      accessLevel: "private",
    }),
  ]);

  console.log("Seed completed.");
  console.log("Operator account seeded.");
  await ds.destroy();
}

run().catch((e) => {
  console.error(e);
  process.exit(1);
});

import "reflect-metadata";
import { createHash, randomUUID } from "node:crypto";
import { readFileSync } from "node:fs";
import { join } from "node:path";
import { DataSource } from "typeorm";
import { dbConfig } from "./database.config";
import { User } from "./users/user.entity";
import { Note } from "./notes/note.entity";

async function run() {
  const flagIdor = process.env.FLAG_IDOR || "FLAG{private_dispatch_n09}";
  const pinCode = process.env.PIN_CODE || "518274";
  const pinHash = createHash("sha256").update(pinCode).digest("hex");
  if (!/^\d{6}$/.test(pinCode)) {
    throw new Error("PIN_CODE must contain exactly six digits.");
  }
  const dispatch = readFileSync(
    join(__dirname, "evidence", "nara-to-cai.txt"),
    "utf8",
  ).replace("{{FLAG_IDOR}}", flagIdor);

  const ds = new DataSource(dbConfig);
  await ds.initialize();

  const users = ds.getRepository(User);
  const notes = ds.getRepository(Note);

  // Clears and RESETS the ID sequence (operator=1, admin=2 every time).
  await ds.query("TRUNCATE TABLE notes, users RESTART IDENTITY CASCADE");

  const alice = await users.save(
    users.create({
      email: "alt.cunningham@arasaka.int",
      password: pinCode,
      role: "user",
      bio: "Archive operator. My shift ends when the signal drops.",
    }),
  );

  const admin = await users.save(
    users.create({
      email: "admin@vesperarc.local",
      password: randomUUID(),
      role: "admin",
      bio: "Internal Security Directorate // Vesper Arc.",
    }),
  );

  await notes.save([
    notes.create({
      title: "Recovered account directory",
      content:
        "Archive operator: alt.cunningham@arasaka.int. Cai Rook's contact confirmed the identifier, but not the access code.",
      userId: alice.id,
      accessLevel: "public",
    }),
    notes.create({
      title: "Shift protocol",
      content: `The routine access code is exactly six digits. SHA-256 for offline recovery: ${pinHash}`,
      userId: alice.id,
      accessLevel: "public",
    }),
    notes.create({
      title: "Maintenance map // sector 09",
      content:
        "Cargo elevator: sector 09. The underground radio channel loses signal during the shift change.",
      userId: alice.id,
      accessLevel: "public",
    }),
    notes.create({
      title: "Security bulletin",
      content:
        "The Directorate isolated a dispatch from Alt Cunningham. The remote portal trusts the role field in the access token.",
      userId: alice.id,
      accessLevel: "public",
    }),
    notes.create({
      title: "Pending migration // remote access",
      content:
        "SSH access is reserved for the Directorate. Maintenance credentials are in the administration panel.",
      userId: alice.id,
      accessLevel: "public",
    }),
    notes.create({
      title: "Private dispatch // Alt Cunningham",
      content: dispatch,
      userId: admin.id,
      accessLevel: "private",
    }),
    notes.create({
      title: "Remote access procedure",
      content:
        "SSH maintenance is reserved for the Directorate. Credentials are in the administration panel.",
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

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
    join(__dirname, "evidence", "alt-dispatch.txt"),
    "utf8",
  ).replace("{{FLAG_IDOR}}", flagIdor);

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
      content: `The routine access code is exactly six digits. SHA-256 for offline recovery: ${pinHash}`,
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
      title: "Remote access procedure",
      content:
        "Directorate maintenance relay // SSH service 2222. Operator credentials are provisioned for the current shift only.",
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

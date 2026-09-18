require("dotenv").config({ path: ".env" });
const { PrismaClient } = require("@prisma/client");
const p = new PrismaClient({ log: ["error", "warn"] });
p.$connect()
  .then(() => p.$queryRawUnsafe("SELECT 1 as ok"))
  .then(r => { console.log("DB OK:", JSON.stringify(r)); return p.$disconnect(); })
  .catch(e => { console.error("DB FAIL:", e.message, "\nCode:", e.code); process.exit(1); });

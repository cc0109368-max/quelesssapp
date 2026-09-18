require("dotenv").config({ path: ".env" });
const { PrismaClient } = require("@prisma/client");
const url = process.env.DATABASE_URL;
console.log("Testing URL host:", url ? url.split("@")[1].split("/")[0] : "NONE");
const p = new PrismaClient({ log: ["error"] });
p.$queryRawUnsafe("SELECT current_user as cu, version() as v")
  .then(r => { console.log("OK:", JSON.stringify(r)); return p.$disconnect(); })
  .catch(e => { console.error("FAIL:", e.message.substring(0,200)); process.exit(1); });

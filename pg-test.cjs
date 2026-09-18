const { Client } = require("pg");
const c = new Client({
  host: "127.0.0.1",
  port: 6543,
  database: "postgres",
  user: "postgres.nuxajrduruxfgmboscjh",
  password: "IFhNRrV1YL9oi6R3",
  ssl: { rejectUnauthorized: false },
});
c.connect().then(() => {
  return c.query("SELECT current_user, version()");
}).then(r => {
  console.log("PG OK:", JSON.stringify(r.rows));
  return c.end();
}).catch(e => {
  console.error("PG FAIL:", e.message);
  console.error("Code:", e.code);
  process.exit(1);
});

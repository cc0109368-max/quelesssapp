const net = require("net");

// Supabase Direct IPv6 for nuxajrduruxfgmboscjh
const SUPABASE_IPV6 = "2406:da18:1f5e:4101:fd40:43a:d2f1:13e";
const SUPABASE_POOLER_IPV4 = "52.77.146.31";

const MAPPINGS = [
  // 5432 / 5433 -> direct IPv6 PostgreSQL (bypasses pgbouncer, supports standard postgres user)
  { localPort: 5432, remoteHost: SUPABASE_IPV6, remotePort: 5432, family: 6 },
  { localPort: 6543, remoteHost: SUPABASE_POOLER_IPV4, remotePort: 6543, family: 4 },
];

function createProxy({ localPort, remoteHost, remotePort, family }) {
  const server = net.createServer((client) => {
    const remote = net.createConnection({ host: remoteHost, port: remotePort, family });
    client.pipe(remote);
    remote.pipe(client);
    remote.on("error", (e) => {
      // console.error('[remote err]', e.message);
      client.destroy();
    });
    client.on("error", (e) => {
      // console.error('[client err]', e.message);
      remote.destroy();
    });
    remote.on("close", () => client.destroy());
    client.on("close", () => remote.destroy());
  });
  server.listen(localPort, "127.0.0.1", () => {
    console.log(`[proxy] 127.0.0.1:${localPort} -> [${remoteHost}]:${remotePort} (IPv${family})`);
  });
  server.on("error", (e) => console.error(`[proxy:${localPort}]`, e.message));
}

MAPPINGS.forEach(createProxy);
console.log("[proxy] started");

const { Pool } = require('pg');
const fs = require('fs');
const dotenv = require('dotenv');
const env = dotenv.parse(fs.readFileSync('.env'));
const m = env.DATABASE_URL.match(/:([^:@]+)@/);
const password = m ? m[1] : '';

const users = [
  'postgres.nuxajrduruxfgmboscjh',
  'postgres',
  'postgres.xeqzstphydnhocvctvba'
];

async function testPg() {
  for (const u of users) {
    for (const port of [6543, 5432]) {
      const pool = new Pool({
        host: 'aws-0-ap-southeast-1.pooler.supabase.com',
        port: port,
        user: u,
        password: password,
        database: 'postgres',
        ssl: { rejectUnauthorized: false }
      });
      try {
        const client = await pool.connect();
        const res = await client.query('SELECT current_user, current_database(), now();');
        console.log('>>> SUCCESS with user:', u, 'port:', port, res.rows[0]);
        client.release();
        await pool.end();
        return;
      } catch (err) {
        console.log('FAIL user:', u, 'port:', port, '->', err.message);
        try { await pool.end(); } catch (_) {}
      }
    }
  }
}
testPg();

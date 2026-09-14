import path from 'path';
import dotenv from 'dotenv';
dotenv.config({ path: path.resolve(__dirname, '../../../.env') });

import { PrismaClient } from '@prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';
import { Pool } from 'pg';

let prisma: PrismaClient;

const rawConnectionString = process.env.DATABASE_URL || '';

if (rawConnectionString) {
  const dns = require('dns');
  if (dns.setDefaultResultOrder) {
    dns.setDefaultResultOrder('ipv4first');
  }

  // Remove sslmode query param from connection string so pg doesn't override ssl config
  const cleanUrl = rawConnectionString.replace(/([?&])sslmode=[^&]+(&|$)/, '$1').replace(/[?&]$/, '');

  const pool = new Pool({
    connectionString: cleanUrl,
    ssl: {
      rejectUnauthorized: false,
    },
  });

  const adapter = new PrismaPg(pool);
  prisma = new PrismaClient({ adapter });
} else {
  prisma = new PrismaClient();
}

export { prisma };
export { PrismaClient } from '@prisma/client';

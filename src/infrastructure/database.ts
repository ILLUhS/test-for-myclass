import { Client } from 'pg';
import * as dotenv from 'dotenv';

dotenv.config();
export let client: Client;
export const runDB = async () => {
  client = new Client({
    host: process.env.DATABASE_HOST,
    port: Number(process.env.DATABASE_PORT),
    user: process.env.DATABASE_USER,
    database: process.env.DATABASE_NAME,
    password: process.env.DATABASE_PASSWORD,
  });
  await client.connect();
};

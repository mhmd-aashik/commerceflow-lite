import postgres from 'postgres';
import { drizzle } from 'drizzle-orm/postgres-js';

const client = postgres(
  'postgresql://commerce:commerce123@localhost:5432/commerceflow',
);

export const db = drizzle(client);

import { pgTable, varchar, integer, check } from 'drizzle-orm/pg-core';
import { sql } from 'drizzle-orm';

export const inventory = pgTable(
  'inventory',
  {
    productId: varchar('product_id', {
      length: 50,
    }).primaryKey(),

    stock: integer('stock').notNull().default(0),
  },
  (table) => [check('stock_non_negative', sql`${table.stock} >= 0`)],
);

import { Injectable } from '@nestjs/common';
import { and, eq, gte, sql } from 'drizzle-orm';
import { db } from './database/db.js';
import { inventory } from './database/schema.js';

@Injectable()
export class InventoryService {
  async reserveStock(productId: string, quantity: number) {
    if (!Number.isInteger(quantity) || quantity <= 0) {
      return {
        success: false,
        remainingStock: 0,
        message: 'Invalid quantity',
      };
    }

    const result = await db
      .update(inventory)
      .set({
        stock: sql`${inventory.stock} - ${quantity}`,
      })
      .where(
        and(eq(inventory.productId, productId), gte(inventory.stock, quantity)),
      )
      .returning({
        remainingStock: inventory.stock,
      });

    if (result.length === 0) {
      return {
        success: false,
        remainingStock: 0,
        message: 'Insufficient stock or product not found',
      };
    }

    return {
      success: true,
      remainingStock: result[0].remainingStock,
      message: 'Stock reserved successfully',
    };
  }

  async checkStock(productId: string, quantity: number) {
    const result = await db
      .select()
      .from(inventory)
      .where(eq(inventory.productId, productId))
      .limit(1);

    const currentStock = result[0]?.stock ?? 0;

    return {
      available:
        Number.isInteger(quantity) && quantity > 0 && currentStock >= quantity,
      remainingStock: currentStock,
    };
  }
}

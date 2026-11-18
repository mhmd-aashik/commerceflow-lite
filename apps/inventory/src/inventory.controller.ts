import { Controller } from '@nestjs/common';
import { GrpcMethod } from '@nestjs/microservices';

interface CheckStockRequest {
  productId: string;
  quantity: number;
}

interface CheckStockResponse {
  available: boolean;
  remainingStock: number;
}

@Controller()
export class InventoryController {
  private readonly stock: Record<string, number> = {
    P100: 10,
    P200: 5,
    P300: 0,
  };

  @GrpcMethod('InventoryService', 'CheckStock')
  checkStock(data: CheckStockRequest): CheckStockResponse {
    const currentStock = this.stock[data.productId] ?? 0;

    return {
      available: currentStock >= data.quantity,
      remainingStock: currentStock,
    };
  }

  @GrpcMethod('InventoryService', 'ReserveStock')
  reserveStock(data: { productId: string; quantity: number }) {
    const currentStock = this.stock[data.productId] ?? 0;

    if (data.quantity <= 0) {
      return {
        success: false,
        remainingStock: currentStock,
        message: 'Invalid quantity',
      };
    }

    if (currentStock < data.quantity) {
      return {
        success: false,
        remainingStock: currentStock,
        message: 'Insufficient stock',
      };
    }

    this.stock[data.productId] = currentStock - data.quantity;

    return {
      success: true,
      remainingStock: this.stock[data.productId],
      message: 'Stock reserved successfully',
    };
  }
}

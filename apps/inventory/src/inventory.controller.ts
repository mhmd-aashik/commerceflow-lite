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
}

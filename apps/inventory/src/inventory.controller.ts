import { Controller } from '@nestjs/common';
import { GrpcMethod } from '@nestjs/microservices';
import { InventoryService } from './inventory.service.js';

interface StockRequest {
  productId: string;
  quantity: number;
}

@Controller()
export class InventoryController {
  constructor(private readonly inventoryService: InventoryService) {}

  @GrpcMethod('InventoryService', 'CheckStock')
  async checkStock(data: StockRequest) {
    return this.inventoryService.checkStock(data.productId, data.quantity);
  }

  @GrpcMethod('InventoryService', 'ReserveStock')
  async reserveStock(data: StockRequest) {
    return this.inventoryService.reserveStock(data.productId, data.quantity);
  }

  @GrpcMethod('InventoryService', 'ReleaseStock')
  releaseStock(data: StockRequest) {
    return this.inventoryService.releaseStock(data.productId, data.quantity);
  }
}

import { Inject, Injectable, OnModuleInit } from '@nestjs/common';
import type { ClientGrpc } from '@nestjs/microservices';
import { Observable, firstValueFrom } from 'rxjs';

interface CheckStockRequest {
  productId: string;
  quantity: number;
}

interface CheckStockResponse {
  available: boolean;
  remainingStock: number;
}

interface InventoryGrpcService {
  checkStock(data: CheckStockRequest): Observable<CheckStockResponse>;

  reserveStock(data: { productId: string; quantity: number }): Observable<{
    success: boolean;
    remainingStock: number;
    message: string;
  }>;

  releaseStock(data: { productId: string; quantity: number }): Observable<{
    success: boolean;
    remainingStock: number;
    message: string;
  }>;
}

@Injectable()
export class OrderService implements OnModuleInit {
  private inventoryService!: InventoryGrpcService;

  constructor(
    @Inject('INVENTORY_SERVICE')
    private readonly client: ClientGrpc,
  ) {}

  onModuleInit() {
    this.inventoryService =
      this.client.getService<InventoryGrpcService>('InventoryService');
  }

  async checkInventory(
    productId: string,
    quantity: number,
  ): Promise<CheckStockResponse> {
    return firstValueFrom(
      this.inventoryService.checkStock({
        productId,
        quantity,
      }),
    );
  }

  async reserveInventory(productId: string, quantity: number) {
    return firstValueFrom(
      this.inventoryService.reserveStock({
        productId,
        quantity,
      }),
    );
  }

  async releaseInventory(productId: string, quantity: number) {
    return firstValueFrom(
      this.inventoryService.releaseStock({ productId, quantity }),
    );
  }
}

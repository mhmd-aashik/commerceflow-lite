import { Controller, Get, Query } from '@nestjs/common';
import { OrderService } from './order.service.js';

@Controller('orders')
export class OrderController {
  constructor(private readonly orderService: OrderService) {}

  @Get('check-stock')
  async checkStock(
    @Query('productId') productId: string,
    @Query('quantity') quantity: string,
  ) {
    return this.orderService.checkInventory(productId, Number(quantity));
  }
}

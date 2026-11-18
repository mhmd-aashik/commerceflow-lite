import { Module } from '@nestjs/common';
import { OrderController } from './order.controller.js';
import { OrderService } from './order.service.js';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { join } from 'node:path';

@Module({
  imports: [
    ClientsModule.register([
      {
        name: 'INVENTORY_SERVICE',
        transport: Transport.GRPC,
        options: {
          package: 'inventory',
          protoPath: join(process.cwd(), 'proto/inventory.proto'),
          url: 'localhost:50051',
        },
      },
    ]),
  ],
  controllers: [OrderController],
  providers: [OrderService],
})
export class OrderModule {}

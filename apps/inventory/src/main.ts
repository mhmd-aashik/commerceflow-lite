import { NestFactory } from '@nestjs/core';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';
import { join } from 'node:path';
import { InventoryModule } from './inventory.module.js';

async function bootstrap() {
  const app = await NestFactory.createMicroservice<MicroserviceOptions>(
    InventoryModule,
    {
      transport: Transport.GRPC,
      options: {
        package: 'inventory',
        protoPath: join(process.cwd(), 'proto/inventory.proto'),
        url: '0.0.0.0:50051',
      },
    },
  );

  await app.listen();
}

bootstrap();

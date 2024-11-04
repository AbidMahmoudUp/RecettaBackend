import { Module } from '@nestjs/common';
import { InventoryService } from './inventory.service';
import { InventoryController } from './inventory.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Inventory, inventorySchema } from './entities/inventory.entity';

@Module({
  imports: [MongooseModule.forFeatureAsync(
    [{
    name: Inventory.name, 
    useFactory: () =>{ 
    const schema = inventorySchema 
    return schema }
  }
  ]
)],
  controllers: [InventoryController],
  providers: [InventoryService],
})
export class InventoryModule {}

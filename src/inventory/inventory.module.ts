import { Module } from '@nestjs/common';
import { InventoryService } from './inventory.service';
import { InventoryController } from './inventory.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Inventory, inventorySchema } from './entities/inventory.entity';
import { IngredientService } from 'src/ingrediant/ingredient.service';
import { IngredientModule } from 'src/ingrediant/ingredient.module';

@Module({
  imports: [MongooseModule.forFeatureAsync(
    [{
    name: Inventory.name, 
    useFactory: () =>{ 
    const schema = inventorySchema 
    return schema }
  },
  ]
), IngredientModule],
  controllers: [InventoryController],
  providers: [InventoryService],
})
export class InventoryModule {}

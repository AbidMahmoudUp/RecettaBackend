import { forwardRef, Module } from '@nestjs/common';
import { InventoryService } from './inventory.service';
import { InventoryController } from './inventory.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Inventory, inventorySchema } from './entities/inventory.entity';
import { IngredientModule } from 'src/ingrediant/ingredient.module';
import { AuthModule } from 'src/auth/auth.module';

@Module({
  imports: [
    forwardRef(() => AuthModule),  // Resolves circular dependency with AuthModule
    MongooseModule.forFeature([{
      name: Inventory.name,
      schema: inventorySchema,
    }]),
    IngredientModule,  // IngredientModule is imported here
  ],
  controllers: [InventoryController],
  providers: [InventoryService],
  exports: [InventoryService],  // Export InventoryService for use in other modules
})
export class InventoryModule {}

import { Module } from '@nestjs/common';
import { IngrediantService } from './ingrediant.service';
import { IngrediantController } from './ingrediant.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Ingrediant, ingrediantSchema } from './entities/ingrediant.entity';

@Module({
  imports: [MongooseModule.forFeatureAsync(
    [{
    name: Ingrediant.name, 
    useFactory: () =>{ 
    const schema = ingrediantSchema 
    return schema }
  }
  ]
)],
  controllers: [IngrediantController],
  providers: [IngrediantService],
})
export class IngrediantModule {}

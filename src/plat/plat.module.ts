import { Module } from '@nestjs/common';
import { PlatService } from './plat.service';
import { PlatController } from './plat.controller';
import { Plat, platSchema } from './entities/plat.entity';
import { MongooseModule } from '@nestjs/mongoose';

@Module({
  imports: [MongooseModule.forFeatureAsync(
    [{
    name: Plat.name, 
    useFactory: () =>{ 
    const schema = platSchema 
    return schema }
  }
  ]
)],
  controllers: [PlatController],
  providers: [PlatService],
  exports: [MongooseModule]
})
export class PlatModule {}

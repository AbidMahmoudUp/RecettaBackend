import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UserModule } from './user/user.module';
import { IngrediantModule } from './ingrediant/ingrediant.module';
import { PlatModule } from './plat/plat.module';
import { InventoryModule } from './inventory/inventory.module';
import { RatingModule } from './rating/rating.module';
import { MongooseModule } from '@nestjs/mongoose';
import { ConfigModule } from '@nestjs/config';
import { MongodbConfigService } from './config/mongodb.config.service';

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: '.env',
      isGlobal: true,
      cache: true,
    }),UserModule, 
    IngrediantModule, 
    PlatModule, 
    InventoryModule, 
    RatingModule, 
    MongooseModule.forRootAsync({
    imports: [ConfigModule],
    useClass: MongodbConfigService,
  })],

  controllers: [AppController],

  providers: [AppService],
})
export class AppModule {}

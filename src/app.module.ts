import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { IngrediantModule } from './ingrediant/ingrediant.module';
import { PlatModule } from './plat/plat.module';
import { InventoryModule } from './inventory/inventory.module';
import { RatingModule } from './rating/rating.module';
import { MongooseModule } from '@nestjs/mongoose';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { MongodbConfigService } from './config/mongodb.config.service';
import { AuthModule } from './auth/auth.module';
import { JwtModule } from '@nestjs/jwt';
import { JwtConfig } from './config/jwt.config';

@Module({
  imports: [
    JwtModule.registerAsync({
      imports: [ConfigModule],
      useClass: JwtConfig,
      global: true,
      inject: [ConfigService],
    }),

    ConfigModule.forRoot({
      envFilePath: '.env',
      isGlobal: true,
      cache: true,
    }), AuthModule,
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
export class AppModule { }

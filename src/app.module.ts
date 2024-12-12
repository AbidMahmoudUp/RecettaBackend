import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { IngredientModule } from './ingrediant/ingredient.module';
import { PlatModule } from './plat/plat.module';
import { InventoryModule } from './inventory/inventory.module';
import { RatingModule } from './rating/rating.module';
import { MongooseModule } from '@nestjs/mongoose';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { MongodbConfigService } from './config/mongodb.config.service';
import { AuthModule } from './auth/auth.module';
import { JwtModule } from '@nestjs/jwt';
import { JwtConfig } from './config/jwt.config';
import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'path';
import { FileUploadModule } from './file-upload/file-upload.module';
import { StableDiffusionAiModule } from './stable-diffusion-ai/stable-diffusion-ai.module';
import { HttpModule } from '@nestjs/axios';
import { IngredientService } from './ingrediant/ingredient.service';

@Module({
  imports: [
    JwtModule.registerAsync({
      imports: [ConfigModule],
      useClass: JwtConfig,
      global: true,
      inject: [ConfigService],
    }),
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '..', 'assets'), 
      serveRoot: '/uploads', 
    }),
    ConfigModule.forRoot({
      envFilePath: '.env',
      isGlobal: true,
      cache: true,
    }), AuthModule,
    IngredientModule,
    PlatModule,
    InventoryModule,
    RatingModule,
    MongooseModule.forRootAsync({
      imports: [ConfigModule],
      useClass: MongodbConfigService,
    }),
    FileUploadModule,
    StableDiffusionAiModule,HttpModule],

  controllers: [AppController],
  providers: [AppService,IngredientService],
})
export class AppModule { }

import { Module } from '@nestjs/common';
import { FileUploadService } from './file-upload.service';
import { FileUploadController } from './file-upload.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { IngredientModule } from 'src/ingrediant/ingredient.module';
import { PlatModule } from 'src/plat/plat.module';
import { AuthModule } from 'src/auth/auth.module';

@Module({
  imports: [
    IngredientModule,
    PlatModule,
    AuthModule,
  ],
  controllers: [FileUploadController],
  providers: [FileUploadService],
  
})
export class FileUploadModule {}

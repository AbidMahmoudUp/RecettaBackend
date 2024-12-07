import { forwardRef, Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { MongooseModule } from '@nestjs/mongoose';
import { User, UserSchema } from './Schemas/user.schema';

import { RefreshToken, RefreshTokenSchema } from './schemas/refresh-token.schemas';
import { AuthGuard } from 'src/guards/auth.guard';
import { ResetToken, ResetTokenSchema } from './schemas/reset-token.schemas';
import { MailService } from './services/mail.service';
import { GeneratedCode, generatedCodeSchema } from './schemas/code-generated.schemas';
import { InventoryService } from 'src/inventory/inventory.service';
import { InventoryModule } from 'src/inventory/inventory.module';


@Module({
  imports: [MongooseModule.forFeature([{
    name: User.name,
    schema: UserSchema
  },
  {
    name: RefreshToken.name,
    schema: RefreshTokenSchema
  },
  {
    name: ResetToken.name,
    schema: ResetTokenSchema
  },
  {
    name: GeneratedCode.name,
    schema: generatedCodeSchema
  }
  
  ]),
  
  (forwardRef(() =>InventoryModule))
  ],
  controllers: [AuthController],
  providers: [AuthService, AuthGuard , MailService],
  exports: [MongooseModule]

})
export class AuthModule { }

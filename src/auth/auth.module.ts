import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { JwtModule, JwtService } from '@nestjs/jwt';
import { MongooseModule } from '@nestjs/mongoose';
import { User, UserSchema } from './Schemas/user.schema';
import { ConfigModule } from '@nestjs/config';
import { JwtConfig } from 'src/config/jwt.config';
import { RefreshToken, RefreshTokenSchema } from './schemas/refresh-token.schemas';
import { AuthGuard } from 'src/guards/auth.guard';
import { ResetToken, ResetTokenSchema } from './schemas/reset-token.schemas';
import { MailService } from './services/mail.service';
import { GeneratedCode, generatedCodeSchema } from './schemas/code-generated.schemas';

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


  ],
  controllers: [AuthController],
  providers: [AuthService, AuthGuard , MailService],
  exports: [MongooseModule]
})
export class AuthModule { }

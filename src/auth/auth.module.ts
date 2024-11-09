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

@Module({
  imports: [MongooseModule.forFeature([{
    name: User.name,
    schema: UserSchema
  },
  {
    name: RefreshToken.name,
    schema: RefreshTokenSchema
  }
  ])

  ],
  controllers: [AuthController],
  providers: [AuthService, AuthGuard]
})
export class AuthModule { }

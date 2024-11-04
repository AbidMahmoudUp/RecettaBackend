import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { User, userSchema } from './entities/user.entity';

@Module({
  imports: [MongooseModule.forFeatureAsync(
    [{
    name: User.name, 
    useFactory: () =>{ 
    const schema = userSchema 
    return schema }
  }
  ]
)],
  controllers: [UserController],
  providers: [UserService],
})
export class UserModule {}

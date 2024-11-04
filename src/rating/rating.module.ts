import { Module } from '@nestjs/common';
import { RatingService } from './rating.service';
import { RatingController } from './rating.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Rating, ratingSchema } from './entities/rating.entity';

@Module({
  imports: [MongooseModule.forFeatureAsync(
    [{
    name: Rating.name, 
    useFactory: () =>{ 
    const schema = ratingSchema 
    return schema }
  }
  ]
)],
  controllers: [RatingController],
  providers: [RatingService],
})
export class RatingModule {}

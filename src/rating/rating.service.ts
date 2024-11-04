import { Injectable } from '@nestjs/common';
import { CreateRatingDto } from './dto/create-rating.dto';
import { UpdateRatingDto } from './dto/update-rating.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Rating, ratingDoc } from './entities/rating.entity';
import { Model } from 'mongoose';

@Injectable()
export class RatingService {

  @InjectModel(Rating.name) private model = Model<ratingDoc>

  async create(createRatingDto: CreateRatingDto) {
    return await this.model.create(createRatingDto)
  }

  async findAll() {
    return await this.model.find()
  }

  async findOne(id: string) {
    return await this.model.findById(id)
  }

  async update(id: string, updateRatingDto: UpdateRatingDto) {
    return await this.model.findByIdAndUpdate(id, updateRatingDto, {new : true})
  }

  async remove(id: string) {
    return await this.model.findByIdAndDelete(id)
  }
}

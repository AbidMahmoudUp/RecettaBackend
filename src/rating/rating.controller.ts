import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { RatingService } from './rating.service';
import { CreateRatingDto } from './dto/create-rating.dto';
import { UpdateRatingDto } from './dto/update-rating.dto';

@Controller('api/rating')
export class RatingController {
  constructor(private readonly ratingService: RatingService) {}

  @Post()
  async create(@Body() createRatingDto: CreateRatingDto) {
    return await this.ratingService.create(createRatingDto);
  }

  @Get()
  async findAll() {
    return await this.ratingService.findAll();
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    return await this.ratingService.findOne(id);
  }

  @Patch(':id')
  async update(@Param('id') id: string, @Body() updateRatingDto: UpdateRatingDto) {
    return await this.ratingService.update(id, updateRatingDto);
  }

  @Delete(':id')
  async remove(@Param('id') id: string) {
    return await this.ratingService.remove(id);
  }
}

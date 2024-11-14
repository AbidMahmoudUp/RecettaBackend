import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { RatingService } from './rating.service';
import { CreateRatingDto } from './dto/create-rating.dto';
import { UpdateRatingDto } from './dto/update-rating.dto';
import { ApiBody, ApiResponse } from '@nestjs/swagger';

@Controller('api/rating')
export class RatingController {
  constructor(private readonly ratingService: RatingService) {}

  @ApiResponse({ status: 200})
  @ApiResponse({ status: 404, description: 'Property invalid'})
  @ApiResponse({ status: 403, description: 'Unauthorized'})
  @ApiBody({
    type: CreateRatingDto,
    description: 'Json structure for user object',
 })
  @Post()
  async create(@Body() createRatingDto: CreateRatingDto) {
    return await this.ratingService.create(createRatingDto);
  }

  @ApiResponse({ status: 200})
  @ApiResponse({ status: 403, description: 'Unauthorized'})
  @Get()
  async findAll() {
    return await this.ratingService.findAll();
  }

  @ApiResponse({ status: 200})
  @ApiResponse({ status: 404, description: 'Rating not found'})
  @ApiResponse({ status: 403, description: 'Unauthorized'})
  @Get(':id')
  async findOne(@Param('id') id: string) {
    return await this.ratingService.findOne(id);
  }

  @ApiResponse({ status: 200})
  @ApiResponse({ status: 404, description: 'Rating not found'})
  @ApiResponse({ status: 403, description: 'Unauthorized'})
  @ApiBody({
    type: UpdateRatingDto,
    description: 'Json structure for user object',
 })
  @Patch(':id')
  async update(@Param('id') id: string, @Body() updateRatingDto: UpdateRatingDto) {
    return await this.ratingService.update(id, updateRatingDto);
  }

  @ApiResponse({ status: 200})
  @ApiResponse({ status: 404, description: 'Rating not found'})
  @ApiResponse({ status: 403, description: 'Unauthorized'})
  @Delete(':id')
  async remove(@Param('id') id: string) {
    return await this.ratingService.remove(id);
  }
}

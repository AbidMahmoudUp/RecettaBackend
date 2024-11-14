import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { PlatService } from './plat.service';
import { CreatePlatDto } from './dto/create-plat.dto';
import { UpdatePlatDto } from './dto/update-plat.dto';
import { ApiBody, ApiResponse } from '@nestjs/swagger';

@Controller('api/plat')
export class PlatController {
  constructor(private readonly platService: PlatService) {}

  @ApiResponse({ status: 200})
  @ApiResponse({ status: 404, description: 'Property not valid'})
  @ApiResponse({ status: 403, description: 'Unauthorized'})
  @ApiBody({
    type: CreatePlatDto,
    description: 'Json structure for user object',
 })
  @Post()
  async create(@Body() createPlatDto: CreatePlatDto) {
    return await this.platService.create(createPlatDto);
  }

  @ApiResponse({ status: 200})
  @ApiResponse({ status: 403, description: 'Unauthorized'})
  @Get()
  async findAll() {
    return await this.platService.findAll();
  }

  @ApiResponse({ status: 200})
  @ApiResponse({ status: 404, description: 'Plat not found'})
  @ApiResponse({ status: 403, description: 'Unauthorized'})
  @Get(':id')
  async findOne(@Param('id') id: string) {
    return await this.platService.findOne(id);
  }

  @ApiResponse({ status: 200})
  @ApiResponse({ status: 404, description: 'Plat not found'})
  @ApiResponse({ status: 403, description: 'Unauthorized'})
  @ApiBody({
    type: UpdatePlatDto,
    description: 'Json structure for user object',
 })
  @Patch(':id')
  async update(@Param('id') id: string, @Body() updatePlatDto: UpdatePlatDto) {
    return await this.platService.update(id, updatePlatDto);
  }

  @ApiResponse({ status: 200})
  @ApiResponse({ status: 404, description: 'Plat not found'})
  @ApiResponse({ status: 403, description: 'Unauthorized'})
  @Delete(':id')
  async remove(@Param('id') id: string) {
    return await this.platService.remove(id);
  }
}

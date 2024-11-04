import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { PlatService } from './plat.service';
import { CreatePlatDto } from './dto/create-plat.dto';
import { UpdatePlatDto } from './dto/update-plat.dto';

@Controller('api/plat')
export class PlatController {
  constructor(private readonly platService: PlatService) {}

  @Post()
  async create(@Body() createPlatDto: CreatePlatDto) {
    return await this.platService.create(createPlatDto);
  }

  @Get()
  async findAll() {
    return await this.platService.findAll();
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    return await this.platService.findOne(id);
  }

  @Patch(':id')
  async update(@Param('id') id: string, @Body() updatePlatDto: UpdatePlatDto) {
    return await this.platService.update(id, updatePlatDto);
  }

  @Delete(':id')
  async remove(@Param('id') id: string) {
    return await this.platService.remove(id);
  }
}

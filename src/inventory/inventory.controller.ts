import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { InventoryService } from './inventory.service';
import { CreateInventoryDto } from './dto/create-inventory.dto';
import { UpdateInventoryDto } from './dto/update-inventory.dto';
import { ApiBody, ApiResponse } from '@nestjs/swagger';

@Controller('api/inventory')
export class InventoryController {
  constructor(private readonly inventoryService: InventoryService) {}

  @ApiResponse({ status: 200})
  @ApiResponse({ status: 404, description: 'Property invalid'})
  @ApiResponse({ status: 403, description: 'Unauthorized'})
  @ApiBody({
       type: CreateInventoryDto,
       description: 'Json structure for user object',
    })
  @Post()
  async create(@Body() createInventoryDto: CreateInventoryDto) {
    return await this.inventoryService.create(createInventoryDto);
  }

  @ApiResponse({ status: 200})
  @ApiResponse({ status: 403, description: 'Unauthorized'})

  @Get()
  async findAll() {
    return await this.inventoryService.findAll();
  }

  @ApiResponse({ status: 200})
  @ApiResponse({ status: 404, description: 'Inventory is not found'})
  @ApiResponse({ status: 403, description: 'Unauthorized'})

  @Get(':id')
  async findOne(@Param('id') id: string) {
    return await this.inventoryService.findOneByUserID(id);
  }

  @ApiResponse({ status: 200})
  @ApiResponse({ status: 404, description: 'Inventory is not found'})
  @ApiResponse({ status: 403, description: 'Unauthorized'})
  @ApiBody({
       type: UpdateInventoryDto,
       description: 'Json structure for user object',
    })
  @Patch(':id')
  async update(@Param('id') id: string, @Body() updateInventoryDto: UpdateInventoryDto) {
    return await this.inventoryService.update(id, updateInventoryDto);
  }

  @ApiResponse({ status: 200})
  @ApiResponse({ status: 404, description: 'Inventory is not found'})
  @ApiResponse({ status: 403, description: 'Unauthorized'})
  @Delete(':id')
  async remove(@Param('id') id: string) {
    return await this.inventoryService.remove(id);
  }
}

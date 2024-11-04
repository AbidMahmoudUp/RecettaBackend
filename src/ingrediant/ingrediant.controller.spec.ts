import { Test, TestingModule } from '@nestjs/testing';
import { IngrediantController } from './ingrediant.controller';
import { IngrediantService } from './ingrediant.service';

describe('IngrediantController', () => {
  let controller: IngrediantController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [IngrediantController],
      providers: [IngrediantService],
    }).compile();

    controller = module.get<IngrediantController>(IngrediantController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});

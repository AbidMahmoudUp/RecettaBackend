import { Test, TestingModule } from '@nestjs/testing';
import { IngrediantService } from './ingrediant.service';

describe('IngrediantService', () => {
  let service: IngrediantService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [IngrediantService],
    }).compile();

    service = module.get<IngrediantService>(IngrediantService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});

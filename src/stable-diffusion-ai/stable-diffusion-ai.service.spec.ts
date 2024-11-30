import { Test, TestingModule } from '@nestjs/testing';
import { StableDiffusionAiService } from './stable-diffusion-ai.service';

describe('StableDiffusionAiService', () => {
  let service: StableDiffusionAiService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [StableDiffusionAiService],
    }).compile();

    service = module.get<StableDiffusionAiService>(StableDiffusionAiService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});

import { Test, TestingModule } from '@nestjs/testing';
import { StableDiffusionAiController } from './stable-diffusion-ai.controller';
import { StableDiffusionAiService } from './stable-diffusion-ai.service';

describe('StableDiffusionAiController', () => {
  let controller: StableDiffusionAiController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [StableDiffusionAiController],
      providers: [StableDiffusionAiService],
    }).compile();

    controller = module.get<StableDiffusionAiController>(StableDiffusionAiController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});

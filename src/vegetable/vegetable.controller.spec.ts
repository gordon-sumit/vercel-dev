import { Test, TestingModule } from '@nestjs/testing';
import { VegetableController } from './vegetable.controller';

describe('VegetableController', () => {
  let controller: VegetableController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [VegetableController],
    }).compile();

    controller = module.get<VegetableController>(VegetableController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});

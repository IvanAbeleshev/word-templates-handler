import { Test, TestingModule } from '@nestjs/testing';
import { WordChangerService } from './word-changer.service';

describe('WordChangerService', () => {
  let service: WordChangerService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [WordChangerService],
    }).compile();

    service = module.get<WordChangerService>(WordChangerService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});

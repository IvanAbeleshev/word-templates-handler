import { Test, TestingModule } from '@nestjs/testing';
import { FileSystemFunctionsService } from './file-system-functions.service';

describe('FileSystemFunctionsService', () => {
  let service: FileSystemFunctionsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [FileSystemFunctionsService],
    }).compile();

    service = module.get<FileSystemFunctionsService>(FileSystemFunctionsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});

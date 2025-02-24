import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { WordChangerService } from './word-changer/word-changer.service';
import { FileSystemFunctionsService } from './file-system-functions/file-system-functions.service';

@Module({
  imports: [],
  controllers: [AppController],
  providers: [AppService, WordChangerService, FileSystemFunctionsService],
})
export class AppModule {}

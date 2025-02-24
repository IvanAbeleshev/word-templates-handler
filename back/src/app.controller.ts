import { Body, Controller, Get, Post, Query } from '@nestjs/common';
import { CreateWordInstanceDTO } from './dto/create-word-instance';
import { WordChangerService } from './word-changer/word-changer.service';
import { FileSystemFunctionsService } from './file-system-functions/file-system-functions.service';

@Controller()
export class AppController {
  constructor(
    private readonly fileService: FileSystemFunctionsService,
    private readonly wordChangerService: WordChangerService
  ) {}

  @Get('templates')
  getTemplates() {
    return this.fileService.getAvailableTemplates().filesShortName;
  }

  @Post('word')
  createTemplate(@Body() body: CreateWordInstanceDTO) {
    this.wordChangerService.modifyTemplate(body.templateName, body.data)
    return( {status: true})
  }
}

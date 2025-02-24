import { Injectable } from '@nestjs/common'
import { FileSystemFunctionsService } from 'src/file-system-functions/file-system-functions.service'
import PizZip from 'pizzip'
import Docxtemplater from 'docxtemplater'
import { CreateWordInstanceDTO } from 'src/dto/create-word-instance'

@Injectable()
export class WordChangerService {
  constructor(private fileSystemFunctionService: FileSystemFunctionsService) {}

  async modifyTemplate(templateName: string, replaceValues: {fieldName: string, replacer: string}[]) {
    const templates = this.fileSystemFunctionService.getAvailableTemplates()
    const foundTemplate = templates.filesFullPath.find(el => el.includes(templateName))
    if(!foundTemplate){
      return
    }
    const fileContent = await this.fileSystemFunctionService.getBinaryDataByFilePath(foundTemplate)
    const zip = new PizZip(fileContent)
    const doc = new Docxtemplater(zip, { paragraphLoop: true, linebreaks: true })

    const replacements: Record<string, string> = {};
    for (let replacingValue of replaceValues) {
      replacements[replacingValue.fieldName] = replacingValue.replacer;
    }
    
    doc.render(replacements)
    const buf = doc.getZip().generate({ type: 'nodebuffer' });
    this.fileSystemFunctionService.writeContentWithFilenameToOutputs(buf, 'test')
  }
}

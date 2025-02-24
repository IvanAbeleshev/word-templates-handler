import { Injectable } from '@nestjs/common'
import * as fs from 'fs'
import * as path from 'path'

@Injectable()
export class FileSystemFunctionsService {
  private templateFolderPath = path.join(process.cwd(), 'templates')
  private outputsFolderPath = path.join(process.cwd(), 'outputs')

  getAvailableTemplates():{filesFullPath:string[], filesShortName:string[]} {
    const filesFromTemplatesFolder = this.getFilesFromFolder(this.templateFolderPath)

    const filesFullPath: string[] = []
    const filesShortName: string[] = []
    for (const item of filesFromTemplatesFolder) {
      const fullPath = path.join(this.templateFolderPath, item.name)
      filesShortName.push(item.name)
      const stat = fs.statSync(fullPath)
      if (stat.isFile()) {
        filesFullPath.push(fullPath)
      }
    }


    return {filesFullPath, filesShortName}
  }

  getBinaryDataByFilePath(inputPath: string){
    return fs.promises.readFile(inputPath, 'binary')
  }

  writeContentWithFilenameToOutputs(buf: Buffer<ArrayBufferLike>, filename: string) {
    fs.promises.writeFile(path.join(this.outputsFolderPath, `${filename}.docx`), buf);
  }

  private getFilesFromFolder(filePath: string): fs.Dirent[] {
    const files = fs.readdirSync(filePath, {
      recursive: true,
      withFileTypes: true
    })

    return files
  }
}

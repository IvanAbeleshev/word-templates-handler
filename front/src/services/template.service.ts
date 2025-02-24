import axios from "axios"

class TemplateService {
  private backURL = 'http://localhost:3001'
  public async getTemplatesList(): Promise<string[]> {
    const result = axios.get(`${this.backURL}/templates`)

    return (await result).data
  }

  public createTemplate(templateName:string, data: {fieldName: string, replacer:string}[]) {
    return axios.post(`${this.backURL}/word`, {templateName, data})
  }
}

export default new TemplateService()
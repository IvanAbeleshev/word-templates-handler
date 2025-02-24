import { IsNotEmpty } from "class-validator";

export class CreateWordInstanceDTO {
  @IsNotEmpty()
  templateName: string

  data: {
    fieldName: string
    replacer: string
  }[]
}
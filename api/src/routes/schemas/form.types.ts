export interface IFormField {
  type: string
  question: string
  required: boolean
  [key: string]: any
}

export interface IFormFields {
  [fieldId: string]: IFormField
}

export interface ICreateFormRequest {
  name: string
  fields: IFormFields
}

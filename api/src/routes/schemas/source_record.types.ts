export interface ISourceData {
  question: string
  answer: string
}

export interface ICreateSourceRecordRequest {
  formId: string
  sourceData: ISourceData[]
}

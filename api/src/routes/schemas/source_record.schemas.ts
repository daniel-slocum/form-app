export const SourceDataSchema = {
  $id: 'SourceData',
  title: 'SourceData',
  type: 'object',
  properties: {
    id: {
      type: 'string',
      format: 'uuid',
      description: 'The unique identifier of the source data entry.',
    },
    question: {
      type: 'string',
      description: 'The question associated with this source data entry.',
    },
    answer: {
      type: 'string',
      description: 'The answer associated with this source data entry.',
    },
    sourceRecordId: {
      type: 'string',
      format: 'uuid',
      description: 'The ID of the source record this data entry belongs to.',
    },
  },
  required: ['id', 'question', 'answer', 'sourceRecordId'],
  description: 'Represents a single source data entry.',
}

export const SourceRecordSchema = {
  $id: 'SourceRecord',
  title: 'SourceRecord',
  type: 'object',
  properties: {
    id: {
      type: 'string',
      format: 'uuid',
      description: 'The unique identifier of the source record.',
    },
    formId: {
      type: 'string',
      format: 'uuid',
      description: 'The ID of the form associated with this source record.',
    },
    sourceData: {
      type: 'array',
      items: { $ref: 'SourceData#' },
      description:
        'An array of source data entries associated with this record.',
    },
  },
  required: ['id', 'formId', 'sourceData'],
  description:
    'Represents a source record containing multiple source data entries.',
}

export const GetSourceRecordSchema = {
  params: {
    type: 'object',
    properties: {
      id: {
        type: 'string',
        format: 'uuid',
        description: 'The unique identifier of the source record to retrieve.',
      },
    },
    required: ['id'],
  },
  response: {
    200: { $ref: 'SourceRecord#' },
  },
}

export const CreateSourceRecordSchema = {
  body: {
    type: 'object',
    properties: {
      formId: {
        type: 'string',
        format: 'uuid',
        description: 'The ID of the form associated with this source record.',
      },
      sourceData: {
        type: 'array',
        items: { $ref: 'SourceData#' },
        description:
          'An array of source data entries to associate with this record.',
      },
    },
    required: ['formId', 'sourceData'],
  },
  response: {
    201: { $ref: 'SourceRecord#' },
  },
}

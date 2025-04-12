export const FormSchema = {
  $id: 'Form',
  type: 'object',
  properties: {
    id: {
      type: 'string',
      format: 'uuid',
      description: 'The unique identifier of the form.',
    },
    name: {
      type: 'string',
      description: 'The name of the form.',
    },
    fields: {
      type: 'object',
      additionalProperties: {
        type: 'object',
        properties: {
          type: {
            type: 'string',
            description: 'The type of the field (e.g., text, boolean).',
          },
          question: {
            type: 'string',
            description: 'The question or label for the field.',
          },
          required: {
            type: 'boolean',
            description: 'Indicates whether the field is required.',
          },
        },
        required: ['type', 'question', 'required'],
      },
      description:
        'A map of field IDs (e.g., "field-1", "field-2") to field definitions.',
    },
  },
  required: ['id', 'name', 'fields'],
  description: 'Represents a form with its associated fields.',
}

export const GetFormSchema = {
  params: {
    type: 'object',
    properties: {
      id: {
        type: 'string',
        format: 'uuid',
        description: 'The unique identifier of the form to retrieve.',
      },
    },
    required: ['id'],
  },
  response: {
    200: { $ref: 'Form#' },
  },
}

export const CreateFormSchema = {
  body: {
    type: 'object',
    properties: {
      name: {
        type: 'string',
        description: 'The name of the form to create.',
      },
      fields: {
        type: 'object',
        additionalProperties: {
          type: 'object',
          properties: {
            type: {
              type: 'string',
              description: 'The type of the field (e.g., text, boolean).',
            },
            question: {
              type: 'string',
              description: 'The question or label for the field.',
            },
            required: {
              type: 'boolean',
              description: 'Indicates whether the field is required.',
            },
          },
          required: ['type', 'question', 'required'],
        },
        description:
          'A map of field IDs (e.g., "field-1", "field-2") to field definitions.',
      },
    },
    required: ['name', 'fields'],
  },
  response: {
    201: { $ref: 'Form#' },
  },
}

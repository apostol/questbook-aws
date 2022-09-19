import { FromSchema } from 'json-schema-to-ts'

const ModelSchema = {
  name: 'Model',
  description: 'External file merge example',
  contentType: 'application/json',
  schema: {
    type: 'object',
    properties: {
      id: { type: 'string' },
    },
    required: ['id'],
  },
} as const

type Model = FromSchema<typeof ModelSchema.schema>

export { ModelSchema }
export type { Model }

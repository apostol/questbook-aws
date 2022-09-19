import { FromSchema } from 'json-schema-to-ts'

const StoreModelSchema = {
  name: 'Store',
  description: 'Store of the books',
  contentType: 'application/json',
  schema: {
    type: 'object',
    properties: {
      id: { type: 'string' },
      count: { type: 'number' },
      price: { type: 'number' },
    },
    required: ['id'],
  },
} as const

type StoreModel = FromSchema<typeof StoreModelSchema.schema>

export { StoreModelSchema }
export type { StoreModel }

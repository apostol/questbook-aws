import { FromSchema } from 'json-schema-to-ts'

const BookModelSchema = {
  name: 'Book',
  description: 'External file merge example',
  contentType: 'application/json',
  schema: {
    type: 'object',
    properties: {
      id: { type: 'string' },
      count: { type: 'number' },
      description: { type: 'string' },
      price: { type: 'number' },
      title: { type: 'string' },
      category_id: { type: 'number' },
    },
    required: ['id'],
  },
} as const

type BookModel = FromSchema<typeof BookModelSchema.schema>

export { BookModelSchema as BookModelSchema }
export type { BookModel }

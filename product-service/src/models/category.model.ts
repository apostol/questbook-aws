import { FromSchema } from 'json-schema-to-ts'
const CategoryModelSchema = {
  name: 'Category',
  description: 'Category of the product',
  contentType: 'application/json',
  schema: {
    type: 'object',
    properties: {
      id: { type: 'string' },
      name: { type: 'string' },
      description: { type: 'string' },
    },
    required: ['id'],
  },
} as const
export type CategoryModel = FromSchema<typeof CategoryModelSchema.schema>
export { CategoryModelSchema }

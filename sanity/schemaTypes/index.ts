import { type SchemaTypeDefinition } from 'sanity'
import order from './order'
import product from './product'

export const schema: { types: SchemaTypeDefinition[] } = {
  types: [order, product],
}

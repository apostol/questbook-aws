import { BookRepository } from './bookRepository'

export type { RepositoryInterface } from './repository'
export type { BookRepositoryInterface } from './repository'
export { BookRepository } from './bookRepository'
export const bookRepositoryInstance = new BookRepository()

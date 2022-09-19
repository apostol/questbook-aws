import { BookModel } from '@models/book.model'
import { Model } from '@models/model'

export interface RepositoryInterface<T extends Model> {
  createDataBase: () => void
  create: (model: T) => Promise<T | boolean>
  read: (model: T) => Promise<T | boolean>
  update: (model: T) => Promise<T | boolean>
  delete: (model: T) => Promise<T | boolean>
  list: () => Promise<T[]>
  find: (model: T) => Promise<T[]>
}

export interface BookRepositoryInterface extends RepositoryInterface<BookModel> {
  available: () => Promise<BookModel[]>
}

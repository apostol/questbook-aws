import { BookModel } from '@models/book.model'
import { bookRepositoryInstance, BookRepositoryInterface } from '@repository/index'

export interface BookServiceInterface {
  create: (book: BookModel) => Promise<BookModel | boolean>
  getAll: () => Promise<BookModel[]>
  getAvailable: () => Promise<BookModel[]>
}

export class BookService implements BookServiceInterface {
  private readonly repository: BookRepositoryInterface
  constructor() {
    this.repository = bookRepositoryInstance
    this.repository.createDataBase()
  }
  async create(book: BookModel): Promise<BookModel | boolean> {
    return await this.repository.create(book)
  }
  async getAll(): Promise<BookModel[]> {
    return await this.repository.list()
  }
  async getAvailable(): Promise<BookModel[]> {
    return await this.repository.available()
  }
}

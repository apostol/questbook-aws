import { BookModel } from '../models/book.model'
import { CategoryModel } from '@models/category.model'
import { StoreModel } from '@models/store.model'
import { getDBClient } from '../providers/postgres'
import { logger } from '@utils/logger'

import DBCreateSQL from '../data/db_create.json'
import CategoryList from '../data/categoryList.json'
import ProductList from '../data/productList.json'
import StoreList from '../data/storeList.json'
import { BookRepositoryInterface } from './repository'

export class BookRepository implements BookRepositoryInterface {
  async createDataBase() {
    const _client = getDBClient()
    try {
      await _client.connect()
      const _isCreated = await _client.tableExists('category')
      if (!_isCreated) {
        const _sqls = DBCreateSQL as []
        _sqls.forEach(async (sql) => {
          await _client.execute(sql)
        })
        const categories = CategoryList as []
        categories.forEach(async (item: CategoryModel) => {
          const sql = 'INSERT INTO category (name, description) values ($1,$2)'
          await _client.execute(sql, [item.name, item.description])
        })

        const products = ProductList as []
        products.forEach(async (item: BookModel) => {
          const sql = 'INSERT INTO books (id, title, description, category_id) values ($1,$2,$3, $4)'
          await _client.execute(sql, [item.id, item.title, item.description, item.category_id])
        })

        const store = StoreList as []
        store.forEach(async (item: StoreModel) => {
          const sql = 'INSERT INTO store (book_id, count, price) values ($1,$2,$3)'
          console.log('Execute query: ', sql, JSON.stringify(item))
          await _client.execute(sql, [item.id, item.count, item.price])
        })
      }
    } catch (error) {
      logger.error(error as string)
      throw error
    } finally {
      _client.end()
    }
  }

  async create(item: BookModel): Promise<BookModel | boolean> {
    let rows: BookModel[] | [] = []
    const _client = getDBClient()
    try {
      await _client.connect()
      rows = await _client.execute<BookModel>(
        `INSERT INTO books(description, title, category_id) VALUES($1,$2,$3) RETURNING *`,
        [item.description, item.title, item.category_id],
      )
    } catch (err) {
      logger.error(err as string)
      throw err
    } finally {
      _client.end()
    }
    return (rows.length == 1 ? rows[0] : false) as BookModel
  }

  async read(item: BookModel): Promise<BookModel | boolean> {
    let rows: BookModel[] = []
    const _client = getDBClient()
    try {
      await _client.connect()
      rows = await _client.execute<BookModel>(
        'SELECT id, description, title, price, count, category_id FROM books b left join store s on b.id = s.book_id WHERE id = $1 limit 1',
        [item.id],
      )
    } catch (err) {
      logger.error(err as string)
      throw err
    } finally {
      _client.end()
    }
    return (rows.length == 1 ? rows[0] : null) as BookModel
  }

  async update(item: BookModel): Promise<BookModel | boolean> {
    const _client = getDBClient()
    try {
      await _client.connect()
      if (item.description) await _client.execute('UPDATE books set description = "$1"', [item.description])
      if (item.title) await _client.execute('UPDATE books set title = "$1"', [item.title])
    } catch (err) {
      logger.error(err as string)
      throw err
    } finally {
      _client.end()
    }
    return item
  }

  async delete(item: BookModel): Promise<BookModel | boolean> {
    let rows: BookModel[] = []
    const _client = getDBClient()
    try {
      await _client.connect()
      rows = await _client.execute('DELETE FROM books WHERE id = $1 limit 1 RETURNING *', [item.id])
    } catch (err) {
      logger.error(err as string)
      throw err
    } finally {
      _client.end()
    }
    return (rows.length == 1 ? rows[0] : false) as BookModel
  }

  async list(): Promise<BookModel[]> {
    const _client = getDBClient()
    let rows: BookModel[] = []
    try {
      await _client.connect()
      rows = await _client.execute(
        'SELECT id, description, title, price, count, category_id FROM books b left join store s on b.id = s.book_id',
        [],
      )
    } catch (err) {
      logger.error(err as string)
      throw err
    } finally {
      _client.end()
    }
    return rows
  }

  async find(item: BookModel): Promise<BookModel[]> {
    const result: BookModel[] = []
    const _client = getDBClient()
    try {
      await _client.connect()
      if (item.description) {
        const rows = await _client.execute<BookModel>(`SELECT * FROM books WHERE description like "%$1%"`, [
          item.description,
        ])
        result.concat(rows)
      }
      if (item.title) {
        const rows = await _client.execute<BookModel>(`SELECT * FROM books WHERE tile like "%$1%"`, [item.title])
        result.concat(rows)
      }
    } catch (err) {
      logger.error(err as string)
      throw err
    } finally {
      _client.end()
    }
    return result
  }

  async available(): Promise<BookModel[]> {
    const _client = getDBClient()
    let result: BookModel[] = []
    try {
      await _client.connect()
      result = await _client.execute(
        'SELECT id, description, title, price, count, category_id FROM store left join books b on store.book_id = b.id',
        [],
      )
    } catch (err) {
      logger.error(err as string)
      throw err
    } finally {
      _client.end()
    }
    return result
  }
}

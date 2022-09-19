import { Client, ConnectionConfig, QueryResultRow } from 'pg'
import { EventEmitter } from 'stream'
import { logger } from '@utils/logger'
import { config } from '@services/index'
import { DBProviderInterface } from './dbProvider'

const dbOprions: ConnectionConfig = {
  host: config.get('PG_HOST'),
  port: Number(config.get('PG_PORT')),
  user: config.get('PG_USERNAME'),
  password: config.get('PG_PASSWORD'),
  database: config.get('PG_DATABASE'),
  ssl: {
    rejectUnauthorized: false,
  },
  connectionTimeoutMillis: 5000,
}

export default class PostgresProvider extends EventEmitter implements DBProviderInterface {
  private readonly _client: Client
  constructor() {
    super()
    this._client = new Client(dbOprions)
    this._client.on('error', this.onError.bind(this))
    this._client.on('end', this.onEnd.bind(this))
  }
  static getClient(): DBProviderInterface {
    return new PostgresProvider()
  }
  async connect(): Promise<void> {
    return await this._client.connect()
  }

  async tableExists(name: string): Promise<boolean> {
    const result = await this._client.query(
      "SELECT EXISTS (SELECT FROM pg_tables WHERE schemaname = 'public' AND tablename  = '$1')",
      [name],
    )
    return result.rowCount > 0
  }

  async execute<T>(sql: string, ...args: unknown[] | []): Promise<T[]> {
    const _result = await this._client.query<T & QueryResultRow, unknown[]>(sql, args)
    return _result.rows as T[]
  }
  async end(): Promise<void> {
    return this._client.end()
  }
  onError(...args: unknown[]) {
    logger.error(JSON.stringify(args))
    this.emit('error', ...args)
  }
  onEnd() {
    logger.info('PG client is finished.')
    this.emit('end')
  }
}

export const getDBClient = () => new PostgresProvider()

export interface DBProviderInterface {
  connect(): Promise<void>
  tableExists(name: string): Promise<boolean>
  execute<T>(sql: string, ...args: []): Promise<T[]>
  end(): Promise<void>
}

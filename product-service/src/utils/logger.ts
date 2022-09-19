import { pino } from 'pino'

interface ILogger {
  info: (message: string) => void
  error: (message: string) => void
}

class MyLogger implements ILogger {
  private readonly _logger: pino.Logger
  constructor() {
    this._logger = pino({
      level: process.env.LOG_LEVEL || 'info',
    })
  }
  info(message: string) {
    this._logger.info(message)
  }
  error(message: string) {
    this._logger.error(message)
  }
}

export const logger: ILogger = new MyLogger()

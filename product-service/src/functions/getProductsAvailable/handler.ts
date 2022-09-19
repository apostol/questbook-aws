import { BookRepository } from '@repository/index'
import { apiResponseHandler, errorResponse, successResponse } from '@utils/apiResponse'
import { logger } from '@utils/logger'
import { Handler } from 'aws-lambda/handler'

const getProductsAvailable: Handler = async () => {
  try {
    const repository = new BookRepository()
    return successResponse({ data: await repository.available() })
  } catch (error: unknown) {
    const message = (error as TypeError).message
    logger.error(message)
    return errorResponse({ error: message })
  }
}

export const main = apiResponseHandler(getProductsAvailable)

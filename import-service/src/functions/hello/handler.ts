import {
  apiResponseHandler,
  errorResponse,
  successResponse,
  ValidatedEventAPIGatewayProxyEvent,
} from '@utils/apiResponse'
import { APIGatewayProxyResult } from 'aws-lambda'

import schema from './schema'

const hello: ValidatedEventAPIGatewayProxyEvent<typeof schema> = async (event): Promise<APIGatewayProxyResult> => {
  let response: APIGatewayProxyResult
  try {
    response = successResponse({
      message: `Hello ${event.body.name}, welcome to the exciting Serverless world!`,
    })
  } catch (err: unknown) {
    response = errorResponse({
      error: err instanceof Error ? err.message : 'some error happened',
    })
  }
  return response
}
export const main = apiResponseHandler(hello as unknown)

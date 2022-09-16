import type { ValidatedEventAPIGatewayProxyEvent } from '@libs/api-gateway'
import { apiGatewayResponse } from '@libs/api-gateway'
import { middyfy } from '@libs/lambda'
import { APIGatewayProxyResult } from 'aws-lambda'

import schema from './schema'

const hello: ValidatedEventAPIGatewayProxyEvent<typeof schema> = async (event): Promise<APIGatewayProxyResult> => {
  let response: APIGatewayProxyResult
  try {
    response = apiGatewayResponse(200, {
      message: `Hello ${event.body.name}, welcome to the exciting Serverless world!`,
    })
  } catch (err: unknown) {
    response = apiGatewayResponse(500, {
      error: err instanceof Error ? err.message : 'some error happened',
    })
  }
  return response
}
export const main = middyfy(hello as unknown)

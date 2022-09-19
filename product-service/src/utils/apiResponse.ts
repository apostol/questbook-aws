import middy from '@middy/core'
import httpHeaderNormalizer from '@middy/http-header-normalizer'
import middyJsonBodyParser from '@middy/http-json-body-parser'
import inputOutputLogger from '@middy/input-output-logger'
import cors from '@middy/http-cors'
import type { APIGatewayProxyEvent, APIGatewayProxyResult, Handler } from 'aws-lambda'
import type { FromSchema, JSONSchema } from 'json-schema-to-ts'
import { logger } from './logger'

type ValidatedAPIGatewayProxyEvent<S extends JSONSchema> = Omit<APIGatewayProxyEvent, 'body'> & { body: FromSchema<S> }
export type ValidatedEventAPIGatewayProxyEvent<S extends JSONSchema> = Handler<
  ValidatedAPIGatewayProxyEvent<S>,
  APIGatewayProxyResult
>

interface APIGatewayBodyResult {
  message?: string
  data?: unknown
  error?: string
}

const successResponse = (body: APIGatewayBodyResult): APIGatewayProxyResult => {
  return apiGatewayResponse(200, body)
}

const errorResponse = (body: APIGatewayBodyResult): APIGatewayProxyResult => {
  return apiGatewayResponse(500, body)
}

const apiGatewayResponse = (statusCode: number, body: APIGatewayBodyResult): APIGatewayProxyResult => {
  return {
    statusCode,
    body: JSON.stringify(body),
  }
}

const apiResponseHandler = (handler: unknown) => {
  return middy(handler as undefined)
    .use(httpHeaderNormalizer())
    .use(middyJsonBodyParser())
    .use(cors())
    .use(
      inputOutputLogger({
        logger: (request) => {
          logger.info(request.event ?? request.response)
        },
        awsContext: true,
      }),
    )
}

export { successResponse, errorResponse, apiGatewayResponse, apiResponseHandler }

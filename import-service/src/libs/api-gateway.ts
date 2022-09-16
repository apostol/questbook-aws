import type { APIGatewayProxyEvent, APIGatewayProxyResult, Handler } from 'aws-lambda'
import type { FromSchema, JSONSchema } from 'json-schema-to-ts'

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

export const apiGatewayResponse = (statusCode: number, body: APIGatewayBodyResult): APIGatewayProxyResult => {
  return {
    statusCode,
    body: JSON.stringify(body),
  }
}

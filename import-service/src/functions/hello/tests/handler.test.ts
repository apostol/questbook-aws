import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda'
import { main } from '../handler'
import apiRequest from '@tests/requests/api.json'
import mock from './handler.test.mock.json'

describe('Unit test for hello handler', function () {
  it('verifies successful response', async () => {
    const request: APIGatewayProxyEvent = Object.assign(apiRequest, mock) as unknown as APIGatewayProxyEvent
    const result: APIGatewayProxyResult = await main(request)
    expect(result.statusCode).toEqual(200)
    expect(result.body).toEqual(
      JSON.stringify({
        message: `Hello ${request?.body?.name}, welcome to the exciting Serverless world!`,
      }),
    )
  })
})

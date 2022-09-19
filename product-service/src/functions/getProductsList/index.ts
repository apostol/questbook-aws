import { handlerPath } from '@utils/handler-resolver'

export default {
  handler: `${handlerPath(__dirname)}/handler.main`,
  events: [
    {
      http: {
        method: 'get',
        path: 'product',
        cors: true,
        //openapi-documentation plugin
        documentation: {
          summary: 'Book list',
          description: 'Get book list',
          requestBody: {
            description: 'Request information about all books',
          },
          requestModels: {
            'application/json': '{}',
          },
          methodResponses: [
            {
              statusCode: 200,
              responseBody: {
                description: 'Book list',
              },
              responseModels: {
                'application/json': 'Book',
              },
            },
            // {
            //   statusCode: 500,
            //   responseBody: {
            //     description: 'An error message when creating a new user',
            //   },
            //   responseModels: {
            //     'application/json': 'Error',
            //   },
            // },
          ],
        },
        //auto-swagger plugin
        // responseData: {
        //   // response with description and response body
        //   200: {
        //     description: 'OK',
        //     bodyType: 'APIGatewayProxyResult',
        //   },
        //   // response with just a description
        //   400: {
        //     description: 'Failed',
        //   },
        //   // shorthand for just a description
        //   500: 'server error',
        // },
        // cors: {
        //   origin: '*',
        //   headers: [
        //     "Content-Type",
        //     "X-Amz-Date",
        //     "Authorization",
        //     "X-Api-Key",
        //     "X-Amz-Security-Token"
        //   ]
        // },
        // private: true,
        // async: true,
        // response: {
        //   headers: {
        //     "Access-Control-Allow-Origin": "'*'",
        //     "Access-Control-Allow-Methods": "'*'"
        //   }
        // }
      },
    },
  ],
}

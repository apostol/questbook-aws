import middy from '@middy/core'
import httpHeaderNormalizer from '@middy/http-header-normalizer'
import middyJsonBodyParser from '@middy/http-json-body-parser'
import inputOutputLogger from '@middy/input-output-logger'
import cors from '@middy/http-cors'
import logger from './logger'

export const middyfy = (handler: unknown) => {
  return middy(handler as unknown as undefined)
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

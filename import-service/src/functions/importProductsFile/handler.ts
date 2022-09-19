import { apiResponseHandler, errorResponse, successResponse } from '@utils/apiResponse'
import { APIGatewayEvent, APIGatewayProxyResult, Handler } from 'aws-lambda'
import ConfigService from '@services/configService'
import S3Service from '@services/S3Service'

const importProductsFile: Handler<APIGatewayEvent, APIGatewayProxyResult> = async (event) => {
  const config = new ConfigService()
  const filename = event.queryStringParameters?.name
  const s3Service = new S3Service(config)
  if (filename) {
    return await s3Service
      .getSignedUrlPromise(config.get('UPLOAD_FOLDER') + filename)
      .then((temporaryLink: string) => {
        return successResponse({ data: { temporaryLink } })
      })
      .catch((reason: string) => {
        return errorResponse({ error: reason })
      })
  }
  return errorResponse({ error: 'File is not set.' })
}

export const main = apiResponseHandler(importProductsFile)

import { middyfy } from '@libs/lambda'
import { APIGatewayEvent, APIGatewayProxyResult, Handler } from 'aws-lambda'
import { apiGatewayResponse } from '@libs/api-gateway'
import { S3Service } from 'src/services/S3Service'
import { ConfigService } from 'src/services/configService'

const importProductsFile: Handler<APIGatewayEvent, APIGatewayProxyResult> = async (event) => {
  const config = new ConfigService()
  const filename = event.queryStringParameters?.name
  const s3Service = new S3Service(config)
  if (filename) {
    return await s3Service
      .getSignedUrlPromise(config.get('UPLOAD_FOLDER') + filename)
      .then((temporaryLink) => {
        return apiGatewayResponse(200, { data: { temporaryLink } })
      })
      .catch((reason) => {
        return apiGatewayResponse(500, { error: reason })
      })
  }
  return apiGatewayResponse(500, { error: 'File is not set.' })
}

export const main = middyfy(importProductsFile)

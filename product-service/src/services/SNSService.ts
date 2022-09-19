import { SNS } from 'aws-sdk'
import { config } from './index'

export class SNSService {
  private readonly sns: SNS
  private readonly bucket: string
  constructor() {
    this.sns = new SNS({
      region: config.get('REGION'),
    })
    this.bucket = config.get('UPLOAD_BUCKET')
  }
}

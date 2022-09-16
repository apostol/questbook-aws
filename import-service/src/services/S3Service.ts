import { S3 } from 'aws-sdk'
import { ConfigService } from './configService'

export class S3Service {
  private readonly s3: S3
  private readonly bucket: string
  constructor(private readonly configService: ConfigService) {
    this.s3 = new S3({
      // accessKeyId: this.configService.get(''),
      // secretAccessKey: this.configService.get(''),
      region: this.configService.get('REGION'),
    })
    this.bucket = this.configService.get('UPLOAD_BUCKET')
  }
  public async upload(name: string, contentType: string, buffer: Buffer): Promise<any> {
    const params = { Bucket: this.bucket, Key: 'key', Body: buffer }
    const upload = await this.s3.upload(params).promise()
    return upload
  }

  public async getSignedUrlPromise(filename: string): Promise<string> {
    const params = {
      Bucket: this.bucket,
      Expires: 600,
      ContentType: 'text/csv',
      Key: filename,
    }
    return this.s3.getSignedUrlPromise('putObject', params)
  }
}

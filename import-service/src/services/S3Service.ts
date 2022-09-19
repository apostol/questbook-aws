import { S3 } from 'aws-sdk'
import ConfigService from './configService'

export default class S3Service {
  private readonly s3: S3
  private readonly bucket: string
  constructor(private readonly configService: ConfigService) {
    this.s3 = new S3({
      region: this.configService.get('REGION'),
    })
    this.bucket = this.configService.get('UPLOAD_BUCKET')
  }
  public async upload(name: string, contentType: string, buffer: Buffer): Promise<any> {
    const params = { Bucket: this.bucket, Key: name, Body: buffer, ContentType: contentType }
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

  public async getObject(fileName: string): Promise<any> {
    const params = { Bucket: this.bucket, Key: fileName }
    const getObject = await this.s3.getObject(params).promise()
    return getObject
  }

  public async copyObject(from: string, to: string) {
    return this.s3
      .copyObject({
        Bucket: this.bucket,
        CopySource: `${this.bucket}/${from}`,
        Key: to,
      })
      .promise()
  }

  public async deleteObject(fileName: string) {
    return this.s3
      .deleteObject({
        Bucket: this.bucket,
        Key: fileName,
      })
      .promise()
  }
}

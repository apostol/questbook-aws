import S3Service from '../S3Service'
const mockS3Instance = {
  upload: jest.fn().mockReturnThis(),
  getSignedUrlPromise: jest.fn().mockReturnThis(),
  getObject: jest.fn().mockReturnThis(),
  promise: jest.fn(),
}
jest.mock('aws-sdk', () => ({
  S3: jest.fn(() => mockS3Instance),
}))

describe('S3Service test', () => {
  it('should upload correctly', async () => {
    const configService = {
      get: jest.fn().mockReturnValueOnce('us-east').mockReturnValueOnce('bucket-dev'),
    }
    const s3Service = new S3Service(configService)
    mockS3Instance.promise.mockResolvedValueOnce('fake response')
    const actual = await s3Service.upload('name', 'contentType', Buffer.from('ok'))
    expect(actual).toEqual('fake response')
    expect(mockS3Instance.upload).toBeCalledWith({
      Bucket: 'bucket-dev',
      ContentType: 'contentType',
      Key: 'name',
      Body: Buffer.from('ok'),
    })
  })
  it('should get signed url', async () => {
    const configService = {
      get: jest.fn().mockReturnValueOnce('us-east').mockReturnValueOnce('bucket-dev'),
    }
    const s3Service = new S3Service(configService)
    mockS3Instance.getSignedUrlPromise.mockResolvedValueOnce('fake response')
    const actual = await s3Service.getSignedUrlPromise('test.csv')
    expect(actual).toEqual('fake response')
    expect(mockS3Instance.getSignedUrlPromise).toBeCalledWith('putObject', {
      Bucket: 'bucket-dev',
      Expires: 600,
      ContentType: 'text/csv',
      Key: 'test.csv',
    })
  })
  it('should get object', async () => {
    const configService = {
      get: jest.fn().mockReturnValueOnce('us-east').mockReturnValueOnce('bucket-dev'),
    }
    const s3Service = new S3Service(configService)
    mockS3Instance.promise.mockResolvedValueOnce('fake response')
    const actual = await s3Service.getObject('test.filename')
    expect(actual).toEqual('fake response')
    expect(mockS3Instance.getObject).toBeCalledWith({ Bucket: 'bucket-dev', Key: 'test.filename' })
  })
})

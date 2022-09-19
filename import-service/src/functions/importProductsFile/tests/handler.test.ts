import { main } from '../handler'
import apiRequest from '@tests/requests/api.json'
import mock from './handler.test.mock.json'

const mockS3ServiceInstance = {
  getSignedUrlPromise: jest.fn().mockReturnThis(),
  promise: jest.fn(),
}
const mockConfigService = {
  get: jest.fn().mockReturnValueOnce(process.env.UPLOAD_FOLDER),
}

jest.mock('@services/S3Service', () => jest.fn(() => mockS3ServiceInstance))
jest.mock('@services/configService', () => jest.fn(() => mockConfigService))

describe('Unit test for import file', function () {
  it('verifies successful response', async () => {
    const request = Object.assign(apiRequest, mock) as unknown
    mockS3ServiceInstance.getSignedUrlPromise.mockResolvedValue('Signed URL')
    const result = await main(request)
    expect(result.statusCode).toEqual(200)
    expect(mockS3ServiceInstance.getSignedUrlPromise).toBeCalledWith('uploaded/test.cvs')
  })
})

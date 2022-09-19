import logger from 'src/utils/logger'
import { SQS } from 'aws-sdk'
import ConfigService from './configService'

export default class SQSService {
  private readonly sqs: SQS
  private readonly url: string
  constructor(private readonly configService: ConfigService) {
    this.sqs = new SQS({
      region: this.configService.get('REGION'),
    })
    this.url = this.configService.get('SQS')
  }

  async sendMessages(records: Record<string, unknown>[]): Promise<Record<string, unknown>[]> {
    const results = await Promise.allSettled(
      records.map(async (record) => {
        await this.sqs
          .sendMessage({
            QueueUrl: this.url,
            MessageBody: JSON.stringify(record),
          })
          .promise()
          .catch((reason) => {
            logger.error(reason)
          })
      }),
    ).then((result) => {
      const all = result.map((record, index) => {
        return {
          status: record.status,
          data: records[index],
        }
      })
      return all
    })
    return results.filter((data) => data.status === 'rejected')
  }
}

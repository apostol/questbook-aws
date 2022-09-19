import { SQSBatchItemFailure, SQSHandler } from 'aws-lambda'
import * as AWS from 'aws-sdk'
import { BookModel } from '@models/book.model'
import { logger } from '@utils/logger'
import { BookRepository } from '@repository/index'
type PromiseResult = { item: BookModel; message: string }

const getPromiseResult = (result: PromiseSettledResult<PromiseResult>[], status: 'fulfilled' | 'rejected') => {
  return (result.filter((n) => n.status === status) as PromiseFulfilledResult<PromiseResult>[]).map<PromiseResult>(
    (v) => v.value,
  )
}

export const main: SQSHandler = async (event) => {
  const snsTopicArn = process.env.SNS_ARN
  const sns = new AWS.SNS({ region: process.env.REGION })
  try {
    const batchItems = await Promise.allSettled<PromiseResult>(
      event.Records.map(async (record): Promise<PromiseResult> => {
        let _product
        if (Buffer.isBuffer(record.body)) {
          _product = Buffer.from(record.body, 'utf-8').toString()
        } else {
          _product = record.body
        }
        const json = JSON.parse(_product) as BookModel
        const item = await new BookRepository().create(json)
        return new Promise((resolve, reject) => {
          if (item == null) reject({ item: json, message: record.messageId })
          resolve({ item: json, message: record.messageId })
        })
      }),
    )
    const _resolved = getPromiseResult(batchItems, 'fulfilled')
    if (_resolved.length > 0) {
      await sns
        .publish({
          Subject: 'Result of import of product',
          Message: JSON.stringify(_resolved),
          TopicArn: snsTopicArn,
        })
        .promise()
    }
    const _rejected = getPromiseResult(batchItems, 'rejected')
    if (_rejected.length > 0) {
      return {
        batchItemFailures: _rejected.map<SQSBatchItemFailure>((v) => {
          return { itemIdentifier: v.message }
        }, []),
      }
    }
  } catch (err) {
    logger.error(err as string)
  }
}

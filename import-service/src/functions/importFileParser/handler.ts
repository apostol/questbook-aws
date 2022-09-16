import csv from 'csv-parser'
import logger from '@libs/logger'
import { Handler } from 'aws-lambda/handler'
import { S3Event } from 'aws-lambda/trigger/s3'
import AWS from 'aws-sdk'

const queueUrl = process.env.SQS_URL as string
const uploadFolder = process.env.UPLOAD_FOLDER as string
const parsedFolder = process.env.PARSED_FOLDER as string

export const main: Handler<S3Event, void> = async (event) => {
  const s3 = new AWS.S3({ region: process.env.REGION })
  const sqs = new AWS.SQS({ region: process.env.REGION })
  await Promise.all(
    event.Records.map(async (record) => {
      try {
        const filename = decodeURIComponent(record.s3.object.key)
        const to = filename.replace(uploadFolder, parsedFolder)
        const _uploadFile = to.replace('.csv', '.json')
        logger.info('Parsing file ', record)
        const data = await new Promise<Record<string, unknown>[]>((resolve, reject) => {
          const _obj = s3.getObject({ Bucket: record.s3.bucket.name, Key: filename })
          const datas: Record<string, unknown>[] = []
          _obj
            .createReadStream()
            .pipe(csv({ separator: ';' }))
            .on('data', async (data: Record<string, unknown>) => {
              datas.push(data)
              sqs
                .sendMessage({
                  QueueUrl: queueUrl,
                  MessageBody: JSON.stringify(data),
                })
                .send((err) => logger.error(err))
            })
            .on('end', () => resolve(datas))
            .on('error', (err) => reject(err))
        })
        const _data = Buffer.from(JSON.stringify(data), 'utf-8')
        s3.upload({
          Bucket: record.s3.bucket.name,
          Key: _uploadFile,
          ContentType: 'application/json',
          Body: _data,
        }).promise()
        s3.copyObject({
          Bucket: record.s3.bucket.name,
          CopySource: `${record.s3.bucket.name}/${filename}`,
          Key: to,
        }).promise()
        s3.deleteObject({
          Bucket: record.s3.bucket.name,
          Key: filename,
        }).promise()
      } catch (err) {
        logger.error(err)
      }
    }),
  )
}

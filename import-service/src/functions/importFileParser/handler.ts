import csv from 'csv-parser'
import logger from '@utils/logger'
import { Handler } from 'aws-lambda/handler'
import { S3Event } from 'aws-lambda/trigger/s3'
import ConfigService from '@services/configService'
import S3Service from '@services/S3Service'
import SQSService from '@services/SQSService'

const config = new ConfigService()
class ImportFileParser {
  private readonly s3: S3Service
  private readonly fileName: string
  private readonly uploadFolder: string
  private readonly parsedFolder: string

  private parsedRecords: Record<string, unknown>[]

  constructor(private readonly config: ConfigService, fileName: string) {
    this.s3 = new S3Service(config)
    this.uploadFolder = config.get('UPLOAD_FOLDER')
    this.parsedFolder = config.get('PARSED_FOLDER')
    this.fileName = fileName
    this.parsedRecords = []
  }

  async parse(): Promise<Record<string, unknown>[]> {
    const _obj = await this.s3.getObject(this.fileName)
    this.parsedRecords = await new Promise<Record<string, unknown>[]>((resolve) => {
      const datas: Record<string, unknown>[] = []
      _obj
        .createReadStream()
        .pipe(csv({ separator: ';' }))
        .on('data', async (data: Record<string, unknown>) => {
          datas.push(data)
        })
        .on('end', () => resolve(datas))
        .on('error', (err: any) => logger.error(err))
    })
    return this.parsedRecords
  }

  saveRecords(): void {
    const to = this.fileName.replace(this.uploadFolder, this.parsedFolder).replace('.csv', '.json')
    const _data = Buffer.from(JSON.stringify(this.parsedRecords), 'utf-8')
    this.s3.upload(to, 'application/json', _data).catch((error) => logger.error(error as string))
  }

  moveSource(): void {
    const to = this.fileName.replace(this.uploadFolder, this.parsedFolder)
    this.s3
      .copyObject(this.fileName, to)
      .then(() => {
        this.s3.deleteObject(this.fileName)
      })
      .catch((error) => logger.error(error as string))
  }
}

export const main: Handler<S3Event, void> = async (event) => {
  const sqs = new SQSService(config)
  await Promise.allSettled(
    event.Records.map(async (record) => {
      try {
        const filename = decodeURIComponent(record.s3.object.key)
        const importFileParser = new ImportFileParser(config, filename)
        const records = await importFileParser.parse()
        importFileParser.saveRecords()
        importFileParser.moveSource()
        sqs.sendMessages(records)
      } catch (err) {
        logger.error(err)
      }
    }),
  )
}

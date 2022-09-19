import { handlerPath } from 'src/utils/handler-resolver'

export default {
  handler: `${handlerPath(__dirname)}/handler.main`,
  events: [
    {
      s3: {
        bucket: '${self:custom.s3ImportServiceBucket}',
        event: 's3:ObjectCreated:*',
        rules: [{ prefix: '${self:custom.uploadFolder}' }],
        existing: true,
      },
    },
  ],
}

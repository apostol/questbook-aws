import { handlerPath } from '@utils/handler-resolver.util'
export default {
  handler: `${handlerPath(__dirname)}/handler.main`,
  events: [
    {
      sqs: {
        batchSize: 5,
        arn: '${param:QueueArn}',
      },
    },
  ],
}

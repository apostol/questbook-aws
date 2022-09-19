import { handlerPath } from '@utils/handler-resolver.util'

export default {
  handler: `${handlerPath(__dirname)}/handler.main`,
  events: [
    {
      http: {
        //cors: true,
        method: 'get',
        path: 'product/available',
      },
    },
  ],
}

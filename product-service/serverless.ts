import type { AWS } from '@serverless/typescript'

import getProductsList from '@functions/getProductsList'
import getProductsAvailable from '@functions/getProductsAvailable'
import catalogBatchProcess from '@functions/catalogBatchProcess'
import { BookModelSchema } from '@models/book.model'

const serverlessConfiguration: AWS = {
  service: 'productService',
  useDotenv: true,
  frameworkVersion: '3',
  configValidationMode: 'off',
  plugins: [
    'serverless-esbuild',
    'serverless-auto-swagger',
    '@martinsson/serverless-openapi-documentation',
    'serverless-offline',
  ],
  provider: {
    name: 'aws',
    runtime: 'nodejs14.x',
    region: 'eu-west-1',
    stage: 'dev',
    profile: '${self:custom.profile.${self:custom.stage}}',
    apiGateway: {
      minimumCompressionSize: 1024,
      shouldStartNameWithService: true,
    },
    environment: {
      AWS_NODEJS_CONNECTION_REUSE_ENABLED: '1',
      NODE_OPTIONS: '--enable-source-maps --stack-trace-limit=1000',
      PG_HOST: '${env:PG_HOST, "qb-base.cuiavnuwfd3p.eu-west-1.rds.amazonaws.com"}',
      PG_PORT: '${env:PG_PORT, "5432"}',
      PG_USERNAME: '${env:PG_USERNAME, "postgres"}',
      PG_PASSWORD: '${env:PG_PASSWORD, ""}',
      PG_DATABASE: '${env:PG_DATABASE, "questbooks"}',
      SNS_ARN: { Ref: 'SNSTopic' },
    },
    iam: {
      role: {
        statements: [
          {
            Effect: 'Allow',
            Action: ['sns:*'],
            Resource: { Ref: 'SNSTopic' },
          },
        ],
      },
    },
  },
  resources: {
    Resources: {
      SNSTopic: {
        Type: 'AWS::SNS::Topic',
        Properties: {
          TopicName: '${self:custom.snsTopic}',
        },
      },
      SNSSubscription: {
        Type: 'AWS::SNS::Subscription',
        Properties: {
          Endpoint: 'admin@dpankratov.ru',
          Protocol: 'email',
          TopicArn: {
            Ref: 'SNSTopic',
          },
        },
      },
    },
  },
  // import the function via paths
  functions: {
    getProductsList,
    getProductsAvailable,
    catalogBatchProcess,
  },
  package: { individually: true },
  custom: {
    region: '${opt:region, self:provider.region}',
    stage: '${opt:stage, self:provider.stage, ""}',
    snsTopic: '${env:SNS_TOPIC, "createProductTopic"}',
    profile: {
      prod: 'free',
      dev: 'free',
    },
    'serverless-offline': {
      httpPort: 4000,
    },
    esbuild: {
      bundle: true,
      minify: true,
      sourcemap: true,
      exclude: ['aws-sdk'],
      target: 'node14',
      define: { 'require.resolve': undefined },
      platform: 'node',
      concurrency: 10,
    },
    documentation: {
      version: '1',
      title: 'QuestBook REST API',
      description: 'QuestBook REST API',
      models: [BookModelSchema],
    },
    autoswagger: {
      apiType: 'http',
      generateSwaggerOnDeploy: true,
      typefiles: ['./types/src/model/product.schema.d.ts'],
      //      swaggerFiles: ['./doc/openAPI.json'],
      swaggerPath: 'swagger',
      //      apiKeyHeaders: ['Authorization', 'anyOtherName']
      //      useStage: true,
      //      basePath: '/',
      //      host: 'http://some-host',
      schemes: ['https'],
      excludeStages: ['prod'],
    },
  },
}

module.exports = serverlessConfiguration

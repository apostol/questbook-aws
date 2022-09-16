import type { AWS } from '@serverless/typescript'

// import importProductsFile from '@functions/importProductsFile'
// import importFileParser from '@functions/importFileParser'

const serverlessConfiguration: AWS = {
  service: 'import-service',
  useDotenv: true,
  frameworkVersion: '3',
  plugins: ['serverless-esbuild'],
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
      UPLOAD_BUCKET: '${self:custom.s3ImportServiceBucket}',
      REGION: '${self:provider.region}',
      UPLOAD_FOLDER: '${self:custom.uploadFolder}',
      PARSED_FOLDER: '${self:custom.parsedFolder}',
      SQS_URL: { Ref: 'SQSQueue' },
    },
    iam: {
      role: {
        statements: [
          {
            Effect: 'Allow',
            Action: ['s3:ListBucket', 's3:GetBucketLocation'],
            Resource: { 'Fn::GetAtt': ['UploadBucket', 'Arn'] },
          },
          {
            Effect: 'Allow',
            Action: ['s3:GetObject', 's3:PutObject', 's3:DeleteObject', 's3:CopyObject'],
            Resource: {
              'Fn::Join': ['', [{ 'Fn::GetAtt': ['UploadBucket', 'Arn'] }, '/*']],
            },
          },
          {
            Effect: 'Allow',
            Action: ['sqs:*'],
            Resource: { 'Fn::GetAtt': ['SQSQueue', 'Arn'] },
          },
        ],
      },
    },
  },
  // import the function via paths
  // functions: {
  //     importProductsFile,
  //     importFileParser,
  // },
  custom: {
    region: '${opt:region, self:provider.region}',
    stage: '${opt:stage, self:provider.stage, ""}',
    profile: {
      prod: 'free',
      dev: 'free',
    },
    s3ImportServiceBucket: '${env:s3ImportServiceBucket, "smd-isb-vue"}',
    uploadFolder: '${env:UPLOAD_FOLDER, "uploaded/"}',
    parsedFolder: '${env:PARSED_FOLDER, "parsed/"}',
    sqsName: '${env:SQS_NAME, "catalogItemsQueue"}',
    dlqName: '${env:DLQ_NAME, "catalogDLQQueue"}',
    esbuild: {
      bundle: true,
      minify: false,
      sourcemap: true,
      exclude: ['aws-sdk'],
      target: 'node14',
      define: { 'require.resolve': undefined },
      platform: 'node',
      concurrency: 10,
    },
  },
  resources: {
    Resources: {
      SQSQueue: {
        Type: 'AWS::SQS::Queue',
        Properties: {
          QueueName: '${self:custom.sqsName}',
          RedrivePolicy: {
            deadLetterTargetArn: { 'Fn::GetAtt': ['SQSDLQ', 'Arn'] },
            maxReceiveCount: 5,
          },
        },
      },
      SQSDLQ: {
        Type: 'AWS::SQS::Queue',
        Properties: {
          QueueName: '${self:custom.dlqName}',
        },
      },
      UploadBucket: {
        Type: 'AWS::S3::Bucket',
        // DeletionPolicy: "Retain",
        Properties: {
          BucketName: '${self:custom.s3ImportServiceBucket}',
          CorsConfiguration: {
            CorsRules: [
              {
                AllowedHeaders: ['*'],
                AllowedMethods: ['GET', 'PUT', 'POST', 'HEAD', 'DELETE'],
                AllowedOrigins: ['*'],
              },
            ],
          },
        },
      },

      // BucketPolicyUploadBucket:{
      //   Type: 'AWS::S3::BucketPolicy',
      //   Properties: {
      //     PolicyDocument: {
      //       Version: "2012-10-17",
      //       Statement: [
      //           {
      //             Action: [
      //               "s3:GetObject",
      //               "s3:PutObject",
      //               "s3:DeleteObject",
      //               "s3:CopyObject"
      //             ],
      //             Effect: "Allow",
      //             Resource: {
      //               "Fn::Join":[
      //                 "",[
      //                   {"Fn::GetAtt": ["UploadBucket","Arn"]},
      //                   "/*"
      //                 ]
      //               ]
      //             },
      //             Principal: "*"
      //           }
      //       ]
      //     },
      //     Bucket: {
      //       Ref: "UploadBucket"
      //     }
      //   }
      // }
    },
    Outputs: {
      QueueName: {
        Description: 'The name of the queue',
        Value: { 'Fn::GetAtt': ['SQSQueue', 'QueueName'] },
      },
      QueueURL: {
        Description: 'The URL of the queue',
        Value: { Ref: 'SQSQueue' },
      },
      QueueARN: {
        Description: 'The ARN of the queue',
        Value: { 'Fn::GetAtt': ['SQSQueue', 'Arn'] },
      },
    },
  },
  package: { individually: true },
}

module.exports = serverlessConfiguration

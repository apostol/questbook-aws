### Project structure

The project code base is mainly located within the `src` folder. This folder is divided in:

- `functions` - containing code base and configuration for your lambda functions
- `utils` - containing shared code base between your lambdas
- `tests` - containing settings and data to test solution
- `models` - containing models description
- `data` - containing data to load at DB
- `providers` - containing code base for providers
- `repository` - containing code base for repositories
- `services` - containing code base for services

```
.
├── src
│   ├── functions                # Lambda configuration and source code folder
│   │   ├── <function name>
│   │   │   ├── handler.test.mock.json      # body of request to unit-tests
│   │   │   ├── handler.test.ts             # Jest tests
│   │   │   ├── handler.ts       # lambda source code
│   │   │   ├── index.ts         # lambda Serverless configuration
│   │   └── index.ts             # Import/export of all lambda configurations
│   └── utils                    # Lambda shared code
│   │   └── apiResponse.ts       # API Gateway specific helpers
│   │   └── handler-hesolver.ts  # Sharable library for resolving lambda handlers
│   │   └── logger.ts            # Logger service
│   └── services
│   │   └── bookService.ts       # BookService to work with Books
│   │   └── configService.ts     # ConfigService to work with config
│   │   └── SNSService.ts        # SNSService to work with AWS SNS Service
│   └── repository
│   │   └── bookRepository.ts    # BookRepository to work with requests to the Book Store
│   │   └── repository.ts        # Interface for repositorues
│   └── provider
│   │   └── dbProvider.ts        # Interface for providers
│   │   └── postgres.ts          # Provider for work with postgres (AWS RDS)
│   └── models
│   │   └── book.model.ts        # BookModel + Schema description
│   │   └── category.model.ts    # CategoryModel + Schema description
│   │   └── model.ts             # BaseModel + Schema description 
│   │   └── store.model.ts       # StoreModel + Schema description
│   └── data
│   │   └── categoryList.json    # Category data to load at DB
│   │   └── db_create.json       # SQL request to create DB
│   │   └── bookList.json        # Book data to load at DB
│   │   └── storeList.json       # Store data to load at DB
│   └── tests
│   │   └── config.ts            # jest .env configuration
│   │   └── requests             # folder for sample of requests
│   │   └── responses            # folder for sample of response
├── package.json
├── serverless.ts                # Serverless service file
├── tsconfig.json                # Typescript compiler configuration
└── webpack.config.js            # Webpack configuration
└── jest.config.ts               # Jest configuration
└── .eslintrc.js                 # ESLint configuration
└── .prettierrc.js               # Prettier configuration
└── .dev.env                     # Environment config
```

### 3rd party libraries

- [json-schema-to-ts](https://github.com/ThomasAribart/json-schema-to-ts) - uses JSON-Schema definitions used by API Gateway for HTTP request validation to statically generate TypeScript types in your lambda's handler code base
- [middy](https://github.com/middyjs/middy) - middleware engine for Node.Js lambda. This template uses [http-json-body-parser](https://github.com/middyjs/middy/tree/master/packages/http-json-body-parser) to convert API Gateway `event.body` property, originally passed as a stringified JSON, to its corresponding parsed object
- [@serverless/typescript](https://github.com/serverless/typescript) - provides up-to-date TypeScript definitions for your `serverless.ts` service file
[serverless-openapi-documentation](https://www.npmjs.com/package/@martinsson/serverless-openapi-documentation)
[serverless-auto-swagger](https://github.com/completecoding/serverless-auto-swagger)
- ....


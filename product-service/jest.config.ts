/*
 * For a detailed explanation regarding each configuration property and type check, visit:
 * https://jestjs.io/docs/configuration
 */

export default {
  preset: 'ts-jest/presets/js-with-ts-esm',
  testEnvironment: 'node',
  setupFiles: ['<rootDir>/tests/config.ts'],
  transform: {
    '^.+\\.ts?$': 'esbuild-jest',
  },
  clearMocks: true,
  collectCoverage: true,
  coverageDirectory: 'coverage',
  coverageProvider: 'v8',
  testMatch: ['**/*.test.ts'],
  moduleNameMapper: {
    '^@functions/(.*)$': '<rootDir>/src/functions/$1',
    '^@utils/(.*)$': '<rootDir>/src/utils/$1',
    '^@libs/(.*)$': '<rootDir>/src/libs/$1',
    '^@models/(.*)$': '<rootDir>/src/models/$1',
    '^@repository/(.*)$': '<rootDir>/src/repository/$1',
    '^@tests/(.*)$': '<rootDir>/tests/$1',
    '^@services/(.*)$': '<rootDir>/src/services/$1',
  },
}

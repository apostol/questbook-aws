export class ConfigService {
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  constructor() {}
  public get(key: string): string {
    return process.env[key] as string
  }
}

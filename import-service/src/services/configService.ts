export class ConfigService {
  public get(key: string): string {
    return process.env[key] as string
  }
}

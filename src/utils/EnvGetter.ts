export interface EnvGetter {
  get(key: string): string | undefined;
}

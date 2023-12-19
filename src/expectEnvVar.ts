import { EnvGetter } from "./utils/EnvGetter";

const errors: Error[] = [];
export function expectEnvVar(
  env: EnvGetter,
  name: keyof AppEnv,
  purpose: string
): string {
  const value = env.get(name);
  if (!value) {
    errors.push(
      new Error(
        `Missing environment variable ${JSON.stringify(
          name
        )}=... needed for "${purpose}"`
      )
    );
    setTimeout(() => {
      if (errors.length) {
        console.error("Missing environment variables:");
        errors.forEach((error) => console.error(error));
        errors.length = 0;
        process.exit(1);
      }
    });
    return "";
  }
  return value;
}

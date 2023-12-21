import type { EnvGetter } from "./utils/EnvGetter";

const errors: Error[] = [];
export function expectEnvVar(
  env: EnvGetter,
  name: keyof AppEnvServer,
  purpose: string,
  defaultValue?: string,
): string {
  const value = env.get(name);
  if (!value && defaultValue != null) {
    console.warn(
      `${missingMessage(name, purpose)}, using default value ${JSON.stringify(
        defaultValue,
      )}`,
    );
    return defaultValue;
  }
  if (!value) {
    errors.push(new Error(missingMessage(name, purpose)));
    setTimeout(() => {
      if (errors.length) {
        console.error("Missing environment variables:");
        errors.forEach((error) => console.error(error));
        errors.length = 0;
        if (env.get("NODE_ENV") === "development") {
          console.error(
            "If you're in local development, ensure you've copied and customized ./.env.example to ./.env.local for server variables.",
          );
        }
        process.exit(1);
      }
    });
    return "";
  }

  return value;
}

function missingMessage(name: string, purpose: string) {
  return `Missing environment variable ${JSON.stringify(
    name,
  )}=... needed for "${purpose}"`;
}

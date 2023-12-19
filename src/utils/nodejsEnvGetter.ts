import { EnvGetter } from "./EnvGetter";

export const nodejsEnvGetter: EnvGetter = {
  get(key) {
    return process.env[key];
  },
};

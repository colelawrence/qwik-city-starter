/** App environment variables */
declare interface AppEnv {
  /**
   * CMS API key for Builder.io
   * https://www.builder.io/c/docs/using-your-api-key
   *
   * @example "d6f1f0d3d9e84b7f8b9b1c0f4d0a4d9a"
   */
  PUBLIC_BUILDER_API_KEY: string;
  /**
   * Postgres connection string
   *
   * @example "postgres://user:password@localhost:5432/mydb"
   */
  APP_PG_CONNECTION_STRING: string;
  /**
   * Salt for hashing auth data into JWT tokens or related in Auth.js
   *
   * @example "a0_dm@ab.v89aw9Uw67Y6aw%$35^o7"
   */
  AUTH_SECRET: string;
  /** @example "support@dogwalkie.com" */
  APP_EMAIL_SUPPORT_REPLY_TO: string;
  /** @example "Dog Walkie" */
  APP_EMAIL_SENDER: string;
}

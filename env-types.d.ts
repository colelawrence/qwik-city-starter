/** App environment variables */
declare interface AppEnv {
  /**
   * CMS API key for Builder.io
   * https://www.builder.io/c/docs/using-your-api-key
   *
   * @example "ce7c5ad7237141b38203fe6bd28b0aa6"
   */
  PUBLIC_BUILDER_API_KEY: string;
  /** @example "support@dogwalkie.com" */
  APP_EMAIL_SUPPORT_REPLY_TO: string;
  /** @example "Dog Walkie" */
  APP_EMAIL_SENDER: string;
  /** @example "debug" */
  APP_LOG_LEVEL: string;
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
}

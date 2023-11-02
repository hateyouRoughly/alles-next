export interface CustomEnv {
    DB_NAME?: string | any
    CONNECTION_URL?: string | any;
    [key: string]: unknown;
}
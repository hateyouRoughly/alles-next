export interface CustomEnv {
    // database configuration
    DB_NAME?: string | any
    CONNECTION_URL?: string | any;

    // etsy configuration
    ETSY_END_POINT?: string | any;
    ETSY_SELLER?: string | any;
    ETSY_INCLUDE_IMAGE?: string;
    ETSY_UPDATE?: string;
    ETSY_FORCE_UPDATE?: string;

    // api thread configuration
    MAX_API_THREAD?: string | any;
    MAX_IMAGE_THREAD?: string | any;
    [key: string]: unknown;
}
const SECONDS_DAY = 86400;

const config = {

    VERSION: "1.201",
    IPCDB_USERNAME: "postgres",
    IPCDB_PASSWORD: "postgres",
    IPCDB_DATABASE: "myipc",
    IPCDB_HOST: "postgres",
    IPCDB_PORT: 5432,

    IPCDB_WEB3_PROVIDER: "https://eth-mainnet.g.alchemy.com/v2/mCcAT4K-9GsRqYKRw8aq9d6oZMkS8x52",
    IPCDB_WEB3_CONTRACTADDR: "0x011C77fa577c500dEeDaD364b8af9e8540b808C0",
    IPCDB_WEB3_TIMEOUT: 1000,

    IPCDB_IPC_NEXTUPDATE: SECONDS_DAY * 1,

    IPC_LIST_LIMIT: 24,

    DEVELOPMENT_MODE: 0,

    PRODUCTION_DIR: "react/build/", 
    PUBLIC_ROOT: "/",

    backdrop: {zIndex: 9999},
    walletConnect: {zIndex: 9998}

    // The following will be deprecated soon.
    // public_url: "",
    // backend_url: "",
    // BACKEND_ROOT: "",
};

config.public_url = config.PUBLIC_ROOT;
config.backend_url = config.PUBLIC_ROOT;
config.BACKEND_ROOT = config.PUBLIC_ROOT;

module.exports = config;

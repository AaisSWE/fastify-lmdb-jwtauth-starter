import "dotenv/config";

const env = {
    port: process.env.PORT || 3000,
    jwtSecret: process.env.JWT_SECRET || "supersecret",
    lmdbPath: process.env.LMDB_PATH || "./data",
};

export default env;

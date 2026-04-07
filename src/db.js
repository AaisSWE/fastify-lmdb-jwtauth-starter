import { open } from "lmdb";

// Config
const LMDB_PATH = "./data";

const db = open({
    path: LMDB_PATH,
    compression: true,
});

export default db;

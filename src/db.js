import { open } from "lmdb";
import env from "./env.js";

// Config
const LMDB_PATH = env.lmdbPath;

const db = open({
    path: LMDB_PATH,
    compression: true,
});

export default db;

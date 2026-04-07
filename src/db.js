import { open } from "lmdb";

// Config
const LMDB_PATH = "./data";
const LMDB_DB_USERS = "users";

// DB
const db = open({
    path: LMDB_PATH,
    compression: true,
});

const users = db.openDB({ name: LMDB_DB_USERS });

// User-repo
export async function createUser({ id, username, passwordHash }) {
    await users.put(id, { id, username, passwordHash });
}

export async function findUserByUsername(username) {
    for (const { value } of users.getRange()) {
        if (value.username === username) return value;
    }

    return null;
}

export async function findUserById(id) {
    return users.get(id);
}

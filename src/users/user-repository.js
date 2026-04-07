import db from "../db.js";

const LMDB_DB_USERS = "users";

export default class UserRepository {
    constructor() {
        this.users = db.openDB({ name: LMDB_DB_USERS });
    }

    async createUser({ id, username, passwordHash }) {
        await this.users.put(id, { id, username, passwordHash });
    }

    async findUserByUsername(username) {
        for (const { value } of this.users.getRange()) {
            if (value.username === username) return value;
        }

        return null;
    }

    async findUserById(id) {
        return this.users.get(id);
    }
}

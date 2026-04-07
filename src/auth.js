import fp from "fastify-plugin";
import bcrypt from "bcrypt";
import jwt from "@fastify/jwt";
import env from "./env";

// Change this for your real app
const JWT_SECRET = env.jwtSecret;

async function authPlugin(app) {
    await app.register(jwt, {
        secret: JWT_SECRET,
    });

    app.decorate("authenticate", async function (req, reply) {
        try {
            await req.jwtVerify();
        } catch (err) {
            return reply.code(401).send({ error: "unauthorized" });
        }
    });

    app.decorate("hashPassword", (password) => bcrypt.hash(password, 10));

    app.decorate("verifyPassword", (password, hash) =>
        bcrypt.compare(password, hash),
    );
}

export class PasswordService {
    constructor(app) {
        this.app = app;
    }

    async hashPassword(password) {
        return await this.app.hashPassword(password);
    }

    async verifyPassword(password, hash) {
        return await this.app.verifyPassword(password, hash);
    }
}

export default fp(authPlugin);

import Fastify from "fastify";
import authPlugin from "./auth.js";
import { v4 as uuidv4 } from "uuid";
import UserRepository from "./users/user-repository.js";

const app = Fastify({ logger: true });

const userRepo = new UserRepository();

async function build() {
    await app.register(authPlugin);

    // register
    app.post("/register", async (req, reply) => {
        const { username, password } = req.body;

        const existing = await userRepo.findUserByUsername(username);
        if (existing) {
            return reply.code(400).send({ error: "user exists" });
        }

        const passwordHash = await app.hashPassword(password);
        const id = uuidv4();

        await userRepo.createUser({ id, username, passwordHash });

        return { ok: true };
    });

    // login
    app.post("/login", async (req, reply) => {
        const { username, password } = req.body;

        const user = await userRepo.findUserByUsername(username);
        if (!user) {
            return reply.code(401).send({ error: "invalid" });
        }

        const valid = await app.verifyPassword(password, user.passwordHash);

        if (!valid) {
            return reply.code(401).send({ error: "invalid" });
        }

        const token = app.jwt.sign({ id: user.id });

        return { token };
    });

    // protected
    app.get("/me", { preHandler: app.authenticate }, async (req, reply) => {
        const user = await userRepo.findUserById(req.user.id);
        // Emit password hash to client
        const response = { id: user.id, username: user.username };

        return response;
    });
}

build().then(() => {
    app.listen({ port: 3000 }, (err, address) => {
        if (err) throw err;
        console.log(`server running at ${address}`);
    });
});

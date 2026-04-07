import Fastify from "fastify";
import authPlugin from "./auth.js";
import { PasswordService } from "./auth.js";
import UserService from "./users/user-service.js";
import UserRepository from "./users/user-repository.js";

const app = Fastify({ logger: true });

const userRepo = new UserRepository();
const passwordService = new PasswordService(app);
const userService = new UserService(app.log, userRepo, passwordService);

async function build() {
    await app.register(authPlugin);

    // register
    app.post("/register", async (req, reply) => {
        const { username, password } = req.body;
        const user = await userService.createUserAsync({ username, password });

        if (user.error) {
            return reply.code(400).send({ error: user.error });
        }

        return { ok: true };
    });

    // login
    app.post("/login", async (req, reply) => {
        const { username, password } = req.body;
        const result = await userService.loginUserAsync({ username, password });

        if (result.error) {
            return reply.code(400).send({ error: result.error });
        }

        const token = app.jwt.sign({ id: result });

        return { token };
    });

    // protected
    app.get("/me", { preHandler: app.authenticate }, async (req, reply) => {
        const user = await userService.findUserByIdAsync(req.user.id);
        const response = {
            id: user.id,
            username: user.username,
            created: user.createdTime,
        };

        return response;
    });
}

build().then(() => {
    app.listen({ port: 3000 }, (err, address) => {
        if (err) throw err;
        console.log(`server running at ${address}`);
    });
});

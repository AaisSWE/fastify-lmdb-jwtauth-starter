import Fastify from "fastify";
import authPlugin from "./auth.js";
import { PasswordService } from "./auth.js";
import UserService from "./users/user-service.js";
import UserRepository from "./users/user-repository.js";
import buildUserController from "./users/user-controller.js";

const app = Fastify({ logger: true });

// TODO In future - move to DI designated file
const userRepo = new UserRepository();
const passwordService = new PasswordService(app);
const userService = new UserService(app.log, userRepo, passwordService);

async function build() {
    await app.register(authPlugin);

    buildUserController(app, userService);
}

build().then(() => {
    app.listen({ port: 3000 }, (err, address) => {
        if (err) throw err;
        console.log(`server running at ${address}`);
    });
});

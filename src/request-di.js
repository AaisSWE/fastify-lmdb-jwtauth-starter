import fp from "fastify-plugin";
import UserRepository from "./users/user-repository.js";
import { PasswordService } from "./auth.js";
import UserService from "./users/user-service.js";

async function perRequestServices(fastify) {
    fastify.decorateRequest("userService", null);

    fastify.addHook("onRequest", async (req, reply) => {
        // Logger & tracing:
        const traceId = req.id;
        const reqLogger = fastify.log.child({ traceId });

        reply.header("x-trace-id", traceId);

        // DI:
        const userRepo = new UserRepository();
        const passwordService = new PasswordService(fastify);
        const userService = new UserService(
            reqLogger,
            userRepo,
            passwordService,
        );

        // Decorate request
        req.userService = userService;

        // Log
        reqLogger.info("Request started");
    });
}

export default fp(perRequestServices);

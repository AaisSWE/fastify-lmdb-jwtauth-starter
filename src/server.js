import Fastify from "fastify";
import authPlugin from "./auth.js";
import perRequestServices from "./request-di.js";
import buildUserController from "./users/user-controller.js";
import { v4 as uuidv4 } from "uuid";

const app = Fastify({
    logger: true,
    genReqId: () => uuidv4(), // So we could have a unique id for each request accross restarts & redeployments
});

async function build() {
    await app.register(authPlugin);
    await app.register(perRequestServices);

    buildUserController(app);
}

build().then(() => {
    app.listen({ port: 3000 }, (err, address) => {
        if (err) throw err;
        console.log(`server running at ${address}`);
    });
});

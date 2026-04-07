export default function buildUserController(app) {
    // register
    app.post("/register", async (req, reply) => {
        const { username, password } = req.body;

        const user = await req.userService.createUserAsync({
            username,
            password,
        });

        if (user.error) {
            return reply.code(400).send({ error: user.error });
        }

        return { ok: true };
    });

    // login
    app.post("/login", async (req, reply) => {
        const { username, password } = req.body;

        const result = await req.userService.loginUserAsync({
            username,
            password,
        });

        if (result.error) {
            return reply.code(400).send({ error: result.error });
        }

        const token = app.jwt.sign({ id: result });

        return { token };
    });

    // protected
    app.get("/me", { preHandler: app.authenticate }, async (req, reply) => {
        const user = await req.userService.findUserByIdAsync(req.user.id);

        const response = {
            id: user.id,
            username: user.username,
            created: user.createdTime,
        };

        return response;
    });
}

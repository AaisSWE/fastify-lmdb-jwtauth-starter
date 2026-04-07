import { v4 as uuidv4 } from "uuid";

export default class UserService {
    constructor(logger, userRepo, passwordService) {
        this.logger = logger;
        this.userRepo = userRepo;
        this.passwordService = passwordService;
    }

    async createUserAsync({ username, password }) {
        // Check if user exists
        const existing = await this.userRepo.findUserByUsername(username);
        if (existing) {
            this.logger.info(`Attempt to create existing user: ${existing.id}`);
            return { error: "user already exists" };
        }

        // Create user
        const id = uuidv4();
        const createdTime = new Date().toISOString();
        const passwordHash = await this.passwordService.hashPassword(password);

        this.logger.info(`Creating user: ${id}`);

        await this.userRepo.createUser({
            id,
            username,
            passwordHash,
            createdTime,
        });

        this.logger.info(`Successfully created user: ${id}`);

        return { id, username, passwordHash };
    }

    async loginUserAsync({ username, password }) {
        this.logger.info(`Logging in user: ${username}`);

        const user = await this.userRepo.findUserByUsername(username);
        if (!user) {
            this.logger.info(`User not found: ${username}`);
            return { error: "user not found" };
        }

        const valid = await this.passwordService.verifyPassword(
            password,
            user.passwordHash,
        );

        if (!valid) {
            this.logger.info(`Invalid password for user: ${user.id}`);
            return { error: "invalid password" };
        }

        return user.id;
    }

    async findUserByIdAsync(id) {
        this.logger.info(`Finding user: ${id}`);
        return this.userRepo.findUserById(id);
    }
}

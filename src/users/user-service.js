import { v4 as uuidv4 } from "uuid";

const MIN_PASSWORD_LENGTH = 8;

/**
 * Checks if a given password is valid.
 * A password is considered valid if it:
 *   - is at least 8 characters long
 *   - contains at least one lowercase letter
 *   - contains at least one uppercase letter
 *   - contains at least one number
 * @param {string} password the password to check
 * @returns {boolean} whether the password is valid
 * @private
 */
function isValidPassword(password) {
    return (
        password.length >= MIN_PASSWORD_LENGTH &&
        password.match(/[a-z]/) &&
        password.match(/[A-Z]/) &&
        password.match(/[0-9]/)
    );
}

// Do not log personally identifiable information in prod apps, therefore, no username in logs.
export default class UserService {
    constructor(logger, userRepo, passwordService) {
        this.logger = logger;
        this.userRepo = userRepo;
        this.passwordService = passwordService;
    }

    async createUserAsync({ username, password }) {
        // Basic validations
        if (!username || !password) {
            return { error: "username and password are required" };
        }

        if (!isValidPassword(password)) {
            return {
                error: "password must be at least 8 characters and contain at least one lowercase letter, one uppercase letter, and one number",
            };
        }

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
        this.logger.info(`Logging in user`);

        if (!username || !password) {
            return { error: "username and password are required" };
        }

        // Check if user exists
        const user = await this.userRepo.findUserByUsername(username);
        if (!user) {
            this.logger.info("User does not exist");
            return { error: `user: ${username} does not exist` };
        }

        // Check password
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

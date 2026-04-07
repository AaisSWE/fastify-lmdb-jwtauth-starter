# Fastify + LMDB Minimal Auth Template

A minimal **Fastify** project template with **LMDB** database and JWT authentication.  
Designed for learning, experimentation, and small real-world applications.

## Getting Started

```bash
npm install
npm run start
```

## API Endpoints

| Method | Route     | Description                                   |
| ------ | --------- | --------------------------------------------- |
| POST   | /register | Register a new user                           |
| POST   | /login    | Login and receive JWT                         |
| GET    | /me       | Get current authenticated user (requires JWT) |

## Test the template

The included `test-api.js` script demonstrates the main authentication flows:

- Registers a **dummy user** with a random suffix to avoid conflicts
- Logs in with the registered user
- Calls `/me` with the token to verify authentication
- Tests that unauthorized access to `/me` is blocked
- Tests login with a wrong password

Run the with:

```bash
npm run test-api
```

// Base URL
const base = "http://localhost:3000";

// --- tiny test runner decorator ---
function test(name, fn) {
    return async () => {
        console.log(`\n🚀 === START TEST: ${name} ===`);
        try {
            await fn();
            console.log(`✅ === DONE TEST: ${name} ===`);
        } catch (err) {
            console.error(`❌ === FAILED TEST: ${name} ===`, err);
        }
    };
}

// --- helpers ---
function randomUsername() {
    return "testuser_" + Math.floor(Math.random() * 10000);
}

async function registerUser(username, password) {
    const res = await fetch(`${base}/register`, {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ username, password }),
    });
    return res.json();
}

async function loginUser(username, password) {
    const res = await fetch(`${base}/login`, {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ username, password }),
    });
    return res.json();
}

async function me(token) {
    const res = await fetch(`${base}/me`, {
        headers: { authorization: `Bearer ${token}` },
    });
    return res.json();
}

// --- TESTS ---

const tests = [
    // 1. register + login + /me in one go
    test("register-login-me flow", async () => {
        const username = randomUsername();
        const password = "123456";

        const registerData = await registerUser(username, password);
        console.log("register:", registerData);

        const loginData = await loginUser(username, password);
        console.log("login:", loginData);

        if (!loginData.token) throw new Error("no token returned");

        const meData = await me(loginData.token);
        console.log("me:", meData);
    }),

    // 2. unauthorized access
    test("unauthorized /me access", async () => {
        const res = await fetch(`${base}/me`);
        const data = await res.json();
        console.log("unauthorized me:", data);

        if (res.status !== 401) throw new Error("should be 401 unauthorized");
    }),

    // 3. login with wrong password
    test("login wrong password", async () => {
        const username = randomUsername();
        const password = "123456";

        await registerUser(username, password);

        const loginData = await loginUser(username, "wrongpass");
        console.log("login with wrong password:", loginData);

        if (!loginData.error)
            throw new Error("should return error for wrong password");
    }),
];

// --- run all tests ---
(async () => {
    for (const t of tests) {
        await t();
    }
    console.log("\n🎉 All tests finished!");
})();

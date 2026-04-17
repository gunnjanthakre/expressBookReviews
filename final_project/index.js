const express = require("express");
const session = require("express-session");
const { general } = require("./router/general.js");
const { authenticated } = require("./router/auth_users.js");

const app = express();
const PORT = 5000;

// ─── Middleware ───────────────────────────────────────────────────────────────
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(
  session({
    secret: "fingerprint_customer",
    resave: true,
    saveUninitialized: true,
  })
);

// ─── Routes ───────────────────────────────────────────────────────────────────
// Public routes (Tasks 1-6)
app.use("/", general);

// Authenticated routes – login is POST /customer/login
// Protected routes live under /customer/auth/...
app.use("/customer", authenticated);

// ─── Start server ─────────────────────────────────────────────────────────────
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});

module.exports = app;
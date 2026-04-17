const express = require("express");
const session = require("express-session");
const { general } = require("./router/general.js");
const { authenticated } = require("./router/auth_users_routes.js");

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(session({ secret: "fingerprint_customer", resave: true, saveUninitialized: true }));

app.use("/", general);
app.use("/customer", authenticated);

app.listen(5000, () => console.log("Server is running on http://localhost:5000"));

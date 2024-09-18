const express = require("express");
const { loginUser, register, logoutUser } = require("../controllers/auth");
const { verify } = require("../middlewares/verify");
const routes = express.Router();

// Route to register a new user
routes.post("/user", register);
// Route to log in a user
routes.post("/login", loginUser);
// Route to log out a user
routes.post("/logout", verify, logoutUser);

module.exports = routes;

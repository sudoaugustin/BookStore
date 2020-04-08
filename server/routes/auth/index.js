const express = require("express");
const app = express();
const register = require("./register");
const login = require("./login");
const logout = require("./logout");
const forgetPass = require("./forgetPass");
const changePass = require("./changePass");
const verify = require("./verify");
app.use("/register", register);
app.use("/verify", verify);
app.use("/login", login);
app.use("/forgetPass", forgetPass);
app.use("/changePass", changePass);
app.use("/logout", logout);

module.exports = app;

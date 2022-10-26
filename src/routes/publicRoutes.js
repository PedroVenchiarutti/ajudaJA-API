const express = require("express");
const users = require("../controller/userController");
const login = require("../controller/login");
const getMsgClient = require("../controller/webChat");
const Routes = express.Router();

//Middlewares validations
const bodyValidation = require("../middlewares/validationMiddleware");

// yup schema
const userSchema = require("../validations/userValidation");

Routes.post("/login", login.login);
Routes.post("/register", bodyValidation(userSchema), users.add);
Routes.get("/webchat", getMsgClient.getMsgClient("chat01#pedro"));

module.exports = Routes;

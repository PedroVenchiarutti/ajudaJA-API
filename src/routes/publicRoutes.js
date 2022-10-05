const express = require("express");
const users = require("../controller/userController");
const Routes = express.Router();

//Middlewares validations
const bodyValidation = require("../middlewares/validationMiddleware");

// yup schema
const userSchema = require("../validations/userValidation");

Routes.post("/login");
// Routes.post("/register", bodyValidation(userSchema), users.add);
Routes.post("/register", users.add);

module.exports = Routes;

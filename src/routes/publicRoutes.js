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

// Crashando a aplicacao resolver
Routes.post("/webchat/:id", getMsgClient.getMsgClient());

// Routes.get("/webchat/room", (req, res) => {
//   const room = getRoom();
//   console.log(room);
// });

module.exports = Routes;

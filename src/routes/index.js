const express = require("express");
const publicRoutes = require("../routes/publicRoutes");
const privateRoutes = require("../routes/privateRoutes");
const tokenMiddleware = require("../middlewares/tokenMiddleware");
const Routes = express.Router();
const users = require("../controller/userController");
const validation = require("../middlewares/validationMiddleware");
const recoveryYup = require("../validations/recovery");

// Recovery password
Routes.post(
  "/private/recovery",
    validation(recoveryYup),
  tokenMiddleware,
  users.passwordRecovery
);

Routes.post(
  "/public/recovery",
  //   validation(recoveryYup),
  users.generateToken
);

Routes.use("/public", publicRoutes);
Routes.use("/private", tokenMiddleware, privateRoutes);

module.exports = Routes;

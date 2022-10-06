const express = require("express");
const users = require("../controller/userController");
const Routes = express.Router();

Routes.get("/users", users.getAll);

module.exports = Routes;

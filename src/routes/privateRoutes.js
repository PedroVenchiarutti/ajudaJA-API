const express = require("express");
const users = require("../controller/userController");
const Routes = express.Router();

Routes.get("/users", users.getAll);
Routes.get("/users/:id", users.getById);
Routes.put("/update/users/:id", users.updateAll);
Routes.patch("/update/users/password/:id", users.updatePassword);
Routes.delete("/delete/users/:id", users.delete);




module.exports = Routes;

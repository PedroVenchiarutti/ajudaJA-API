const express = require("express");
const users = require("../controller/userController");
const client = require("../controller/clientController");
// const webChat = require("../controller/webChat");
const Routes = express.Router();
const validation = require("../middlewares/validationMiddleware");
const passwordToExchange = require("../validations/passwordValidation");

// Rotas de usuarios
Routes.get("/users", users.getAll);
Routes.get("/users/:id", users.getById);
Routes.put("/update/users/:id", users.updateAll);
Routes.patch(
  "/update/users/password/:id",
  validation(passwordToExchange),
  users.updatePassword
);
Routes.delete("/delete/users/:id", users.delete);

// ROTAS DE  CLIENTES
Routes.get("/client/:id", client.getAllKeys);
Routes.put("/client/update/:id", client.updateClient);

// ROTAS DE CADASTRO DE ALERGIA
Routes.put("/client/allergy/update/:id", client.updateAllergy);
Routes.delete("/client/allergy/delete/:id", client.deleteAllergy);

module.exports = Routes;

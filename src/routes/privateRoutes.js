const express = require("express");
const users = require("../controller/userController");
const client = require("../controller/clientController");
// const webChat = require("../controller/webChat");
const Routes = express.Router();

// Rotas para chat do cliente
// Routes.get("/chat", webChat.webChat);

// Rotas de usuarios
Routes.get("/users", users.getAll);
Routes.get("/users/:id", users.getById);
Routes.put("/update/users/:id", users.updateAll);
Routes.patch("/update/users/password/:id", users.updatePassword);
Routes.delete("/delete/users/:id", users.delete);

// ROTAS DE  CLIENTES
Routes.get("/client/:id", client.getAllKeys);
Routes.put("/client/update/:id", client.updateClient);

// ROTAS DE CADASTRO DE ALERGIA
Routes.post("/client/allergy/add", client.addAllergy);
Routes.put("/client/allergy/update/:id", client.updateAllergy);
Routes.delete("/client/allergy/delete/:id", client.deleteAllergy);

module.exports = Routes;

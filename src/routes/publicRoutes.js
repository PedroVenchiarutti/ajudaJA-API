const express = require("express");
const users = require("../controller/userController");
const login = require("../controller/login");
const getMsgClient = require("../controller/webChat");
const client = require("../controller/clientController");
const Routes = express.Router();

//Middlewares validations
const bodyValidation = require("../middlewares/validationMiddleware");

// yup schema
const userSchema = require("../validations/userValidation");

Routes.post("/login", login.login);

Routes.post("/register", bodyValidation(userSchema), users.add);

// Rotas para adicionar o a alergia no banco de dados
Routes.post("/client/allergy/add", client.addAllergy);

// pegandos os dados do clients publicos so se tiver cadastrado alguma alergia
Routes.get("/client/:id", client.getPublicDate);

// Crashando a aplicacao resolver
Routes.post("/webchat/:id", getMsgClient.getMsgClient());

module.exports = Routes;

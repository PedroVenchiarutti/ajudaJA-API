const express = require("express");
const publicRoutes = require("../routes/publicRoutes");
const privateRoutes = require("../routes/privateRoutes");
const { tokenMiddleware, tokenURL } = require("../middlewares/tokenMiddleware");
const Routes = express.Router();
const users = require("../controller/userController");
const validation = require("../middlewares/validationMiddleware");
const recoveryYup = require("../validations/recovery");
const ia = require("../helpers/setMessagesIA");

// Recovery password quando esqueceu
Routes.post(
  "/private/recovery",
  validation(recoveryYup),
  tokenMiddleware,
  users.passwordRecovery
);

// Gerar o token para o password quando esqueceu
Routes.post(
  "/public/recovery",
  //   validation(recoveryYup),
  users.generateToken
);

// Cadastro de msg IA
// Cadastrando a msg para o bot
Routes.post("/private/msgIA", ia.addMessage);
// Cadastrando a resposta do bot
Routes.post("/private/respIA", ia.addResposta);
// Pegando a msg do bot pela collection e uuid
Routes.post("/private/getCollection", ia.getMessages);
// Deletando a msg do bot pela collection e uuid
Routes.post("/private/delete/msg", ia.deleteMessage);

Routes.use("/public", publicRoutes);
Routes.use("/private", tokenMiddleware, privateRoutes);

module.exports = Routes;

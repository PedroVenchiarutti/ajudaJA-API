const db = require("../config/dbconnection");
const crypto = require("../config/bcrypt");
const querys = require("../helpers/querys");
const loginRepository = require("../repositories/loginRepositories");
const apiError = require("../error/apiError");

// Criando uma funcao de login que recebe o email e a senha pelo body da requisicao
exports.login = (req, res, next) => {
  /*
      #swagger.tags = ['Public']
  */

  const { email, password } = req.body;

  // Utilizando a funcao de login criada no repositories
  loginRepository(email, password)
    .then((user) => {
      res.json({
        message: "Login realizado com sucesso",
        user,
      });
    })
    .catch((error) => {
      next(apiError.badRequest(error.message));
    });
};

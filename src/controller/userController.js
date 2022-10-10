const db = require("../config/dbconnection");
const querys = require("../helpers/querys");
const ApiError = require("../error/apiError");

const crypto = require("../config/bcrypt");

// Consultar todos os usuarios
exports.getAll = async (req, res, next) => {
  /*
      #swagger.tags = ['Private / User']
  */

  try {
    querys
      .select("users")
      .then((result) => {
        res.json(result);
      })
      .catch((err) => {
        next(ApiError.internal(err.message));
      });
  } catch (e) {
    next(ApiError.internal(e.message));
  }
};

// Consultar Usuario por ID
exports.getById = async (req, res, next) => {
  /*
      #swagger.tags = ['Private / User']
  */

  try {
    querys.select("users", req.params.id).then((result) => {
      res.json(result);
    });
  } catch (e) {
    next(ApiError.internal(e.message));
  }
};

// Adicionar Usuario
exports.add = async (req, res, next) => {
  /*
      #swagger.tags = ['public']
      #swagger.parameters['obj'] = {
              in: 'body',
              description: 'Informações do usuario',
              required: true,
              type: 'object',
              schema: { 
              $username: "Pedro", 
              $email: "teste@teste.com",
              $password: "123456",
              $passwordConfirmation: "123456"
              }
    }
  */

  try {
    const { username, email, password } = req.body;
    const hash = await crypto.getHash(password);
    const data = {
      username,
      email,
      password: hash,
    };

    querys
      .insert("users", data)
      .then((result) => {
        res.json(result);
      })
      .catch((err) => {
        next(ApiError.internal(err.message));
      });
  } catch (e) {
    next(ApiError.internal(e.message));
  }
};

// Atualizar todos os dados do usuario por ID
exports.updateAll = async (req, res, next) => {
  /*
      #swagger.tags = ['Private / User']
  */
  try {
    const { username, email } = req.body;

    const data = {
      username,
      email,
    };

    querys
      .updateAll("users", data, req.params.id)
      .then((result) => {
        res.status(200).json({
          message: "Usuario atualizado com sucesso! ",
        });
      })
      .catch((err) => {
        next(ApiError.internal(err.message));
      });
  } catch (e) {
    next(ApiError.internal(e.message));
  }
};

// Atualizar somente o password do usuario por ID
exports.updatePassword = async (req, res, next) => {
  /*
      #swagger.tags = ['Private / User']
  */

  try {
    const { password } = req.body;
    const hash = await crypto.getHash(password);

    const data = {
      password: hash,
    };

    querys
      .updatePassword("users", data, req.params.id)
      .then((result) => {
        res.status(200).json({
          message: "Senha atualizada com sucesso! ",
        });
      })
      .catch((err) => {
        next(ApiError.internal(err.message));
      });
  } catch (e) {
    next(ApiError.internal(e.message));
  }
};

// Deletar o usuario por ID
exports.delete = async (req, res, next) => {
  /*
      #swagger.tags = ['Private / User']
  */

  try {
    querys
      .delete("users", req.params.id)
      .then((result) => {
        res.status(200).json({
          message: "Usuario deletado com sucesso! ",
        });
      })
      .catch((err) => {
        next(ApiError.internal(err.message));
      });
  } catch (e) {
    next(ApiError.internal(e.message));
  }
};

const db = require("../config/dbconnection");
const querys = require("../helpers/querys");
const ApiError = require("../error/apiError");

const crypto = require("../config/bcrypt");

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

exports.add = async (req, res, next) => {
  /*
      #swagger.tags = ['public']
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

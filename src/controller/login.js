const db = require("../config/dbconnection");
const crypto = require("../config/bcrypt");
const querys = require("../helpers/querys");
const loginRepository = require("../repositories/loginRepositories");
const apiError = require("../error/apiError");

exports.login = (req, res, next) => {
  const { email, password } = req.body;

  loginRepository(email, password)
    .then((user) => {
      console.log(user);

      res.json(user);
    })
    .catch((error) => {
      next(apiError.badRequest(error.message));
    });
};

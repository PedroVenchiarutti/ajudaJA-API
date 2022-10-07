const db = require("../config/dbconnection");
const querys = require("../helpers/querys");
const ApiError = require("../error/apiError");

const crypto = require("../config/bcrypt");

exports.getAll = async (req, res, next) => {
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

exports.add = async (req, res, next) => {
  try {
    const { username, email, password } = req.body;
    const hash = await crypto.getHash(password);
    console.log(hash);
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

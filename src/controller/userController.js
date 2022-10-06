const db = require("../config/dbconnection");
const querys = require("../helpers/querys");
const ApiError = require("../error/apiError");
const crypto = require("../config/bcrypt");

exports.getAll = async (req, res, next) => {
  const id = 2;
  try {
    querys
      .select("users", 1)
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

    db.quey("insert into users(username,email,password) values(?,?,?)", [
      username,
      email,
      hash,
    ])
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

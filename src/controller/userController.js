const db = require("../config/dbconnection");
const querys = require("../helpers/querys");
const ApiError = require("../error/apiError");

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
    res.json({ message: "User added" });
  } catch (e) {
    next(ApiError.internal(e.message));
  }
};

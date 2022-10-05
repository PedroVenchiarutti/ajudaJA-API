const db = require("../config/dbconnection");
const ApiError = require("../error/apiError");

exports.add = async (req, res, next) => {
  try {
    res.json({ message: "User added" });
  } catch (e) {
    res.status(500).json({ message: "Error" });
  }
};

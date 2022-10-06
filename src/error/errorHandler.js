const ApiError = require("./apiError.js");

const apiErrorHandler = (err, req, res, next) => {
  if (err instanceof ApiError) {
    return res.status(err.status).json(err.message);
  }
  return res.status(500).json("Error interno do servidor");
};

module.exports = apiErrorHandler;

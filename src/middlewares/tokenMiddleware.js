const { decodeToken } = require("../config/token.js");

// Middleware de validação do token
const tokenMiddleware = async (req, res, next) => {
  const token = req.headers.authorization;
  if (!token) {
    return res
      .status(401)
      .json({ auth: false, message: "Token Nao informado" });
  }
  try {
    const decoded = await decodeToken(token);
    next();
  } catch (e) {
    return res.status(401).json({ auth: false, message: e.message });
  }
};

module.exports = tokenMiddleware;

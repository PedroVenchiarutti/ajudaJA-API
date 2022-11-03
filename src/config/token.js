const jwt = require("jsonwebtoken");

// Gerando uma funcao para gerar o token
exports.generateToken = async (userId, timer = "30s") => {
  return jwt.sign(
    {
      id: userId,
    },
    process.env.TOKEN_SECRET,
    {
      // tempo de expiração do token
      expiresIn: timer,
    }
  );
};

// // Refresh Token
exports.generateRefreshToken = async (userId, expiresIn) => {
  return jwt.sign(
    {
      id: userId,
    },
    process.env.APP_SECRET_REFRESH_TOKEN,
    {
      // tempo de expiração do token
      expiresIn: expiresIn,
    }
  );
};

// Gerando uma funcao para validar o token
exports.decodeToken = async (token) => {
  const data = await jwt.verify(token, process.env.TOKEN_SECRET);
  return data;
};

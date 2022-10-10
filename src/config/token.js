const jwt = require("jsonwebtoken");

// Gerando uma funcao para gerar o token
exports.generateToken = async (userId) => {
  return jwt.sign(
    {
      id: userId,
    },
    process.env.TOKEN_SECRET,
    {
      // tempo de expiração do token
      expiresIn: "4h",
    }
  );
};

// Gerando uma funcao para validar o token
exports.decodeToken = async (token) => {
  const data = await jwt.verify(token, process.env.TOKEN_SECRET);
  return data;
};

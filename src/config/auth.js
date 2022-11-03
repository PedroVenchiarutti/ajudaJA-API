const dotenv = require("dotenv").config();

const auth = {
  secret: process.env.APP_SECRET,
  expiresIn: "16m",
  secretRefreshToken: process.env.APP_SECRET_REFRESH_TOKEN,
  expiresInRefreshToken: "12d",
  expiresRefreshTokenDays: 30,
};

module.exports = auth;

const { verify } = require("jsonwebtoken");
const token = require("../config/token");
const auth = require("../config/auth");
const query = require("../helpers/querys");
const dayjs = require("dayjs");
const ApiError = require("../error/apiError");

exports.execute = async (refresh_token) => {
  try {
    const {
      secretRefreshToken,
      expiresInRefreshToken,
      expiresRefreshTokenDays,
    } = auth;

    // pegando o id de dentro do refresh token
    const { id: user_id } = verify(refresh_token, secretRefreshToken);

    const token_user_id = user_id;

    // consultando o refresh token no banco de dados
    const userToken = await query.selectRefreshToken(
      "refreshtoken",
      refresh_token,
      token_user_id
    );

    // verificando se o o refresh token existe no banco de dados
    if (userToken == "") {
      return new ApiError(401, "Refresh token invalido");
    }

    // convertendo a data de expiração do token para o formato dayjs
    const refreshTokenExpiresDay = dayjs()
      .add(expiresRefreshTokenDays, "days")
      .toDate();

    // deletando o refresh token antigo
    await query
      .deleteRefreshToken("refreshtoken", token_user_id)
      .catch((error) => console.log(error));

    const newRefreshToken = await token.generateRefreshToken(
      user_id,
      expiresInRefreshToken
    );

    // inserindo o novo refresh token no banco
    await query.insert("refreshtoken", {
      userid: user_id,
      token: newRefreshToken,
      expiredtime: refreshTokenExpiresDay,
    });

    // Gerando token para rotas
    const newToken = await token.generateToken(user_id);

    const tokenData = {
      id: user_id,
      token: newToken,
      refreshToken: newRefreshToken,
    };

    return tokenData;
  } catch (error) {
    return new ApiError(500, error.message);
  }
};

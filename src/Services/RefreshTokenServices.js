const { verify } = require("jsonwebtoken");
const token = require("../config/token");
const auth = require("../config/auth");
const query = require("../helpers/querys");
const dayjs = require("dayjs");

class RefreshTokenServices {
  async execute(refresh_token) {
    const {
      secretRefreshToken,
      expiresInRefreshToken,
      expiresRefreshTokenDays,
    } = auth;

    const { id: user_id } = verify(refresh_token, secretRefreshToken);

    const token_user_id = user_id;

    const userToken = await query
      .selectRefreshToken("refreshtoken", refresh_token, token_user_id)
      .then((result) => {
        return result;
      })
      .catch((error) => console.log(error));

    if (!userToken) {
      throw new Error("Refresh Token nao existe!");
    }
    const refreshTokenExpiresDay = dayjs()
      .add(expiresRefreshTokenDays, "days")
      .toDate();

    let newRefreshToken = query
      .deleteRefreshToken("refreshtoken", token_user_id)
      .then(async (result) => {
        const newRefreshToken = await token.generateRefreshToken(
          user_id,
          expiresInRefreshToken
        );

        query
          .insert("refreshtoken", {
            userid: user_id,
            token: newRefreshToken,
            expiredtime: refreshTokenExpiresDay,
          })
          .then(async () => {
            const newToken = await token.generateToken(user_id);

            const tokenData = {
              id: user_id,
              token: newToken,
              refreshToken: newRefreshToken,
            };

            return tokenData;
          });
      });

    return newRefreshToken;
  }
}

module.exports = RefreshTokenServices;

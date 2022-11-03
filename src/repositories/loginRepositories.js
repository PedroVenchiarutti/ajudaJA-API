const db = require("../config/dbconnection");
const crypto = require("../config/bcrypt");
const Error = require("../error/apiError");
const token = require("../config/token");
const auth = require("../config/auth");
const query = require("../helpers/querys");
const dayjs = require("dayjs");
const { verifyEmail } = require("../helpers/querys");

// Criando uma função que retorna a query recebendo a tabela por parâmetro
const getQuery = (table) => `SELECT * FROM ${table} WHERE EMAIL = $1`;

// Procurando o usuário no banco de dados pelo email recebido por parâmetro e retornando uma promessa
const getMatchedUser = (email) => {
  return new Promise((resolve, reject) => {
    // verificando se o email existe no banco de dados
    verifyEmail("users", email).then((result) => {
      // Se o email não existir no banco de dados
      if (result.length === 0) {
        reject({ message: "Email não cadastrado" });
      } else {
        // Se o email existir no banco de dados
        db.exec(getQuery("users"), [email])
          .then((result) => {
            resolve(result[0]);
          })
          .catch((error) => reject(error));
      }
    });
  });
};

// Validando o Email e a senha do usuario e retornando uma promessa com os dados caso seja valido
const login = async (email, password) => {
  return new Promise((resolve, reject) => {
    getMatchedUser(email)
      .then((user) => {
        crypto.compareHash(password, user.password).then(async (result) => {
          if (result) {
            const { expiresIn, expiresRefreshTokenDays } = auth;

            const newToken = await token.generateToken(user.id);

            const newRefreshToken = await token.generateRefreshToken(
              user.id,
              expiresIn
            );

            const refreshTokenExpiresDay = dayjs()
              .add(expiresRefreshTokenDays, "days")
              .toDate();

            query
              .insert("refreshtoken", {
                userid: user.id,
                token: newRefreshToken,
                expiredtime: refreshTokenExpiresDay,
              })
              .then(() => {
                const tokenData = {
                  id: user.id,
                  email: user.email,
                  username: user.username,
                  token: newToken,
                  refreshToken: newRefreshToken,
                };
                resolve(tokenData);
              })
              .catch((error) => reject(error));
          } else {
            reject({ message: "Senha incorreta" });
          }
        });
      })
      .catch((error) => reject(error));
  });
};

module.exports = login;

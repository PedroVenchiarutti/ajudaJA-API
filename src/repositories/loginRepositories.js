const db = require("../config/dbconnection");
const crypto = require("../config/bcrypt");
const bcrypt = require("bcrypt");
const token = require("../config/token");

// Criando uma função que retorna a query recebendo a tabela por parâmetro
const getQuery = (table) => `SELECT * FROM ${table} WHERE EMAIL = $1`;

// Procurando o usuário no banco de dados pelo email recebido por parâmetro e retornando uma promessa
const getMatchedUser = (email) => {
  return new Promise((resolve, reject) => {
    db.query(getQuery("users"), [email])
      .then((results) => {
        if (results.rows.length > 0) {
          resolve(results.rows[0]);
        } else {
          reject({ message: "Usuário não encontrado" });
        }
      })
      .catch((error) => reject(error));
  });
};

// Validando o Email e a senha do usuario e retornando uma promessa com os dados caso seja valido
const login = async (email, password) => {
  return new Promise((resolve, reject) => {
    getMatchedUser(email)
      .then((user) => {
        crypto
          .compareHash(password, user.password)
          .then(async (result) => {
            const newToken = await token.generateToken(user.id);
            if (result) {
              const tokenData = {
                id: user.id,
                email: user.email,
                username: user.username,
                token: newToken,
              };
              resolve(tokenData);
            } else {
              reject({ message: "Senha incorreta" });
            }
          })
          .catch((error) => reject({ message: error.message }));
      })
      .catch((error) => reject(error));
  });
};

module.exports = login;

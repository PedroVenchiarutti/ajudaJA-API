const db = require("../config/dbconnection");
const crypto = require("../config/bcrypt");
const bcrypt = require("bcrypt");

const getQuery = (table) => `SELECT * FROM ${table} WHERE EMAIL = $1`;

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

const login = async (email, password) => {
  return new Promise((resolve, reject) => {
    getMatchedUser(email)
      .then((user) => {
        console.log(user.password);
        crypto
          .compareHash(password, user.password)
          .then((result) => {
            console.log(result);
            if (result) {
              resolve(user);
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

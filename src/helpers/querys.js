const db = require("../config/dbconnection");
const crypto = require("../config/bcrypt");

class Querys {
  static select(table, id = null) {
    return new Promise((resolve, reject) => {
      let query = `SELECT * FROM ${table}`;
      let params = [];

      if (id) {
        query += ` WHERE id = ${id}`;
        params.push(id);
      }

      db.exec(query, params)
        .then((result) => resolve(result.rows))
        .catch((err) => reject(err));
    });
  }

  static insert(table, params) {
    return new Promise((resolve, reject) => {
      let query = `INSERT INTO ${table} (`;

      let keys = Object.keys(params);
      let values = Object.values(params);

      let paramKeys = [];
      let paramValues = [];

      keys.forEach((key, index) => {
        paramKeys.push(key);
        paramValues.push(`$${index + 1}`);
      });

      query += `${paramKeys.join(", ")}) VALUES (${paramValues.join(", ")})`;

      db.query(query, values)
        .then((result) => resolve(result.rows))
        .catch((err) => reject(err));
    });
  }

  // Update de todos os campos menos o password
  static updateAll(table, params, id) {
    return new Promise((resolve, reject) => {
      let query = `UPDATE ${table} SET `;

      let keys = Object.keys(params);
      let values = Object.values(params);

      let paramKeys = [];
      let paramValues = [];

      keys.forEach((key, index) => {
        paramKeys.push(`${key} = $${index + 1}`);
        paramValues.push(values[index]);
      });

      query += `${paramKeys.join(", ")} WHERE id = ${id}`;

      db.query(query, values)
        .then((result) => resolve(result.rows))
        .catch((err) => reject(err));
    });
  }

  // Update somente do password do usuário
  static updatePassword(table, params, id) {
    return new Promise((resolve, reject) => {
      let query = `UPDATE ${table} SET password = $1 WHERE id = ${id}`;

      let values = Object.values(params);

      db.query(query, values)
        .then((result) => resolve(result.rows))
        .catch((err) => reject(err));
    });
  }

  static delete(table, id) {
    return new Promise((resolve, reject) => {
      let query = `DELETE FROM ${table} WHERE id = ${id}`;

      db.query(query)
        .then((result) => resolve(result.rows))
        .catch((err) => reject(err));
    });
  }
}

module.exports = Querys;

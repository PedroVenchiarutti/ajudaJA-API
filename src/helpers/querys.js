const db = require("../config/dbconnection");

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
}

module.exports = Querys;

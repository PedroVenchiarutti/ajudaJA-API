const db = require("../config/dbconnection");

class Querys {
  static select(table, id = null) {
    return new Promise((resolve, reject) => {
      let query = `SELECT * FROM ${table}`;
      let params = [];

      if (id) {
        query += `WHERE id = ${id}`;
        params.push(id);
      }

      db.exec(query, params)
        .then((result) => resolve(result.rows))
        .catch((err) => reject(err));
    });
  }
}

module.exports = Querys;

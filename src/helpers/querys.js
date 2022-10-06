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

  static insert(table, data) {
    return new Promise((resolver, reject) => {
      let query = `INSERT INTO ${table} (`;
      let params = [];

      const keys = Object.keys(data);
      const values = Object.values(data);

      keys.forEach((key, index) => {
        query += `${key}`;
        params.push(values[index]);

        if (index < keys.length - 1) {
          query += ", ";
        }
      });

      query += ") VALUES (";

      keys.forEach((key, index) => {
        query += `?`;
        if (index < keys.length - 1) {
          query += ", ";
        }
      });

      query += ")";

      console.log(query);
      db.exec(query, params)
        .then((result) => resolver(result))
        .catch((err) => reject(err));
    });
  }
}

module.exports = Querys;

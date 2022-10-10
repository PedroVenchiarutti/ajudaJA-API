const db = require("../config/dbconnection");

// Criando uma classe para fazer as querys no banco de dados
class Querys {
  // Metodo de select do BD que retorna a query numa promesa recebendo a tabela e o id caso seja consultar por id ou não
  static select(table, id = null) {
    return new Promise((resolve, reject) => {
      let query = `SELECT * FROM ${table}`;
      let params = [];

      // Validando se tiver o ID na query ele irar adicionar o WHERE e o ID na query
      if (id) {
        query += ` WHERE id = ${id}`;
        params.push(id);
      }

      // Executando a query no banco de dados e retornando uma promessa
      db.exec(query, params)
        .then((result) => resolve(result.rows))
        .catch((err) => reject(err));
    });
  }

  static verifyEmail(table, email) {
    return new Promise((resolve, reject) => {
      let query = `SELECT * FROM ${table} WHERE email = $1`;

      db.exec(query, [email])
        .then((result) => resolve(result.rows))
        .catch((err) => reject(err));
    });
  }

  // Metodo de insert do BD que retorna a query numa promessa recebendo a tabela e os parametros
  static insert(table, params) {
    return new Promise((resolve, reject) => {
      let query = `INSERT INTO ${table} (`;

      // Pegando as chaves do objeto params e passando para um array
      let keys = Object.keys(params);

      // Pegando os valores do objeto params e passando para um array
      let values = Object.values(params);

      let paramKeys = [];
      let paramValues = [];

      // Percorrendo o array de chaves e adicionando o $1, $2, $3, ... na query
      keys.forEach((key, index) => {
        paramKeys.push(key);
        paramValues.push(`$${index + 1}`);
      });

      // Adicionando os parametros na query e separando por virgula
      query += `${paramKeys.join(", ")}) VALUES (${paramValues.join(
        ", "
      )}) RETURNING *`;

      // Executando a query no banco de dados e retornando uma promessa
      db.exec(query, values)
        .then((result) => {
          resolve(result);
        })
        .catch((err) => reject(err));
    });
  }

  // Metodo de update de todos os campos menos o password
  static updateAll(table, params, id) {
    return new Promise((resolve, reject) => {
      let query = `UPDATE ${table} SET `;

      // Pegando as chaves do objeto params e passando para um array
      let keys = Object.keys(params);

      // Pegando os valores do objeto params e passando para um array
      let values = Object.values(params);

      let paramKeys = [];
      let paramValues = [];

      // Percorrendo o array de chaves e adicionando o $1, $2, $3, ... na query
      keys.forEach((key, index) => {
        paramKeys.push(`${key} = $${index + 1}`);
        paramValues.push(values[index]);
      });

      // Adicionando os parametros na query e separando por virgula
      query += `${paramKeys.join(", ")} WHERE id = ${id}`;

      // Executando a query no banco de dados e retornando uma promessa
      db.exec(query, values)
        .then((result) => resolve(result.rows))
        .catch((err) => reject(err));
    });
  }

  // Metodo de update somente do password do usuário
  static updatePassword(table, params, id) {
    return new Promise((resolve, reject) => {
      let query = `UPDATE ${table} SET password = $1 WHERE id = ${id}`;

      // Pegando os valores do objeto params e passando para um array
      let values = Object.values(params);

      // Executando a query no banco de dados e retornando uma promessa
      db.exec(query, values)
        .then((result) => resolve(result.rows))
        .catch((err) => reject(err));
    });
  }

  // Metodo de deletar do BD que retorna a query numa promessa recebendo a tabela e o id
  static delete(table, id) {
    return new Promise((resolve, reject) => {
      let query = `DELETE FROM ${table} WHERE id = ${id}`;

      // Executando a query no banco de dados e retornando uma promessa
      db.exec(query)
        .then((result) => resolve(result.rows))
        .catch((err) => reject(err));
    });
  }
}

// Exportando a classe
module.exports = Querys;

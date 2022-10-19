const db = require("../config/dbconnection");

// Criando uma classe para fazer as querys no banco de dados
class Querys {
  // Metodo de select do BD que retorna a query numa promesa recebendo a tabela e o id caso seja consultar por id ou não
  static select(table, id = null) {
    return new Promise((resolve, reject) => {
      let query = `SELECT * FROM ${table} `;
      let params = [];

      // Validando se tiver o ID na query ele irar adicionar o WHERE e o ID na query
      if (id) {
        query += `WHERE id = $1`;
        params.push(id);
      }

      console.log(query);

      // Executando a query no banco de dados e retornando uma promessa
      db.exec(query, params)
        .then((result) => {
          resolve(result);
        })
        .catch((err) => reject(err));
    });
  }

  static verifyEmail(table, email) {
    return new Promise((resolve, reject) => {
      let query = `SELECT * FROM ${table} WHERE email = $1`;

      db.exec(query, [email])
        .then((result) => {
          resolve(result);
        })
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

      console.log(query);

      // Executando a query no banco de dados e retornando uma promessa
      db.exec(query, values)
        .then((result) => {
          resolve(result);
        })
        .catch((err) => reject(err));
    });
  }

  // Metodo de update de todos os campos menos o password
  static updateAll(table, params, id, column = "id") {
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
      query += `${paramKeys.join(", ")} WHERE ${column} = ${id} RETURNING *`;

      console.log(query);

      // Executando a query no banco de dados e retornando uma promessa
      db.exec(query, values)
        .then((result) => resolve(result))
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
        .then((result) => resolve(result))
        .catch((err) => reject(err));
    });
  }

  // Metodo de deletar do BD que retorna a query numa promessa recebendo a tabela e o id
  static delete(table, id, column = "id") {
    return new Promise((resolve, reject) => {
      let query = `DELETE FROM ${table} WHERE ${column} = ${id} RETURNING *`;

      // Executando a query no banco de dados e retornando uma promessa
      db.exec(query)
        .then((result) => resolve(result))
        .catch((err) => reject(err));
    });
  }

  // filtrando os dados do cliente apartir do id do usuario
  static selectKey(table, key) {
    return new Promise((resolve, reject) => {
      let query = `select u.id, u.username, u.email, ui.idinfo, ui.birthday, ui.emergencynumber, ui.helth_insurance, ui."gender", ui."name", ui.lastname, ui.avatar from ${table} u inner join users_informations ui on u.id = ui.user_id where u.id = $1`;

      db.exec(query, [key])
        .then((result) => {
          resolve(result[0]);
        })
        .catch((err) => reject(err));
    });
  }

  // filtrando os dados do cliente apartir do id do usuario
  static updateClient(table, params, id) {
    return new Promise((resolve, reject) => {
      let query = `UPDATE ${table} SET birthday = $1, emergencynumber = $2, helth_insurance = $3, gender =$4, name = $5, lastname = $6, avatar = $7 `;

      // Pegando os valores do objeto params e passando para um array
      let values = Object.values(params);

      query += ` WHERE user_id = ${id} RETURNING *`;

      // Executando a query no banco de dados e retornando uma promessa
      db.exec(query, values)
        .then((result) => resolve(result))
        .catch((err) => reject(err));
    });
  }

  // filtrando as alergias do cliente apartir do id do usuario
  static selectAlergies(table, key) {
    return new Promise((resolve, reject) => {
      let query = `select * from ${table} ia
      inner join users_informations ui on ia.info_id = ui.idinfo where ui.idinfo = 35
      `;

      db.exec(query, [key])
        .then((result) => {
          resolve(result);
        })
        .catch((err) => reject(err));
    });
  }
}

// Exportando a classe
module.exports = Querys;

require("dotenv").config();
const { Client, Pool } = require("pg");

// Criando uma constante com A URL do banco de dados
const connectionString = process.env.DB_URL;

function newClient() {
  return new Client({
    connectionString,
    ssl: {
      rejectUnauthorized: false,
    },
  });
}

// Funcao que recebe query e executa a query no banco de dados
// exports.exec = async (query) => {
//   const client = new Client({
//     connectionString: connectionString,
//     ssl: {
//       rejectUnauthorized: false,
//     },
//   });
//   await client.connect();
//   const result = await client.query(query);
//   await client.end();
//   return result;
// };

// Funcao que recebe query e parametros e executa a query no banco de dados
exports.exec = (query, params = []) => {
  return new Promise((resolve, reject) => {
    const client = newClient();

    client.connect();

    client
      .query(query, params)
      .then((results) => {
        resolve(results.rows);
      })
      .catch((e) => {
        reject(e);
      })
      .then(() => client.end());
  });
};

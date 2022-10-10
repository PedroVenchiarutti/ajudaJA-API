require("dotenv").config();
const { Client, Pool } = require("pg");

// Criando uma constante com A URL do banco de dados
const connectionString = process.env.DB_URL;

// Criando uma instancia do banco de dados

// exports.newClient = () => {
//   const client = new Client({
//     connectionString: connectionString,
//     ssl: {
//       rejectUnauthorized: false,
//     },
//   });
//   return client;
// };

// Funcao que recebe query e executa a query no banco de dados
exports.exec = async (query) => {
  const client = new Client({
    connectionString: connectionString,
    ssl: {
      rejectUnauthorized: false,
    },
  });
  await client.connect();
  const result = await client.query(query);
  await client.end();
  return result;
};

// Funcao que recebe query e parametros e executa a query no banco de dados
exports.query = async (query, params) => {
  const pool = new Pool({
    connectionString: connectionString,
    ssl: {
      rejectUnauthorized: false,
    },
  });
  const result = await pool.query(query, params);
  await pool.end();
  return result;
};

require("dotenv").config();
const { Client, Pool } = require("pg");

const connectionString = process.env.DB_URL;

exports.newPool = () => {
  const pool = new Pool({
    connectionString: connectionString,
    ssl: {
      rejectUnauthorized: false,
    },
  });
  return pool;
};

exports.newClient = () => {
  const client = new Client({
    connectionString: connectionString,
    ssl: {
      rejectUnauthorized: false,
    },
  });
  return client;
};


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

// FUncionando a querys de insert
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

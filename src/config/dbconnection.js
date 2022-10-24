require("dotenv").config();
const { Client, Pool } = require("pg");
const firebase = require("firebase/app");
require("firebase/firestore");

// const { getFirestore, doc, setDoc } = require("firebase/firestore");

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

// const { initializeApp } from "firebase/app";
const firebaseConfig = {
  apiKey: process.env.API_KEY,
  authDomain: process.env.AUTH_DOMAIN,
  databaseURL: process.env.DATABASE_URL,
  projectId: process.env.PROJECT_ID,
  storageBucket: process.env.STORAGE_BUCKET,
  messagingSenderId: process.env.MESSAGING_SENDER_ID,
  appId: process.env.APP_ID,
};

// Initialize Firebase
const firebaseApp = firebase.initializeApp(firebaseConfig);
console.log("Firebase Connection 🚀");

module.exports = { firebaseApp };

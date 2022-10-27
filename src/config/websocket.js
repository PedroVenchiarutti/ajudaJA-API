const { io } = require("./server");
const { NlpManager } = require("node-nlp");
const { firebaseApp } = require("./dbconnectionFirebase");
const { timeFormat, dayFormat } = require("../helpers/newDate");

const manager = new NlpManager({ languages: ["pt"], forcptER: true });
// Adiciona os enunciados e intenções para a NLP

// Criando uma colecancao de dados no Banco de dados Firebase
const messageBot_rsp = firebaseApp.firestore().collection("message_bot_resp");
const messageBot = firebaseApp.firestore().collection("message_bot");

// exports.getMessages = async () => {
//   try {
//     const snapshot = await messageBot.get();
//     const data = snapshot.docs.map((doc) => doc.data());
//     return console.log(data);
//   } catch (error) {
//     console.log(error);
//   }
// };

async function getMessages() {
  try {
    const snapshot = await messageBot_rsp.get();
    const data = snapshot.docs.map((doc) => doc.data());
    return console.log(data);
  } catch (error) {
    console.log(error);
  }
}

// Pegando resposta do banco de dados
async function getSpecifyMessage() {
  try {
    const snapshot = await messageBot.get();
    const data = snapshot.docs.map((doc) => {
      let msg = doc.data().text;
      let intent = doc.data().intent;
      manager.addAnswer("pt", intent, msg);
    });
    return data;
  } catch (error) {
    console.log(error);
  }
}

/// adicioando message do bot
async function addMessage({ text, intent }) {
  try {
    const addData = await messageBot_rsp.add({
      text: text,
      intent: intent,
    });
  } catch (error) {
    console.log(error);
  }
}

// Iniciando o bot e adicionando as mensagens e TReinando o bot
async function getMessageIA() {
  const snapshot = await messageBot_rsp.get();
  const data = snapshot.docs.map((doc) => {
    let msg = doc.data().text;
    let intent = doc.data().intent;
    manager.addDocument("pt", msg, intent);
  });
  return data;
}

async function addMsgClient(collection, data) {
  const msgClient = firebaseApp.firestore().collection(`CLIENT_MSG`);

  let docs = `${collection}_${dayFormat(new Date())}`;

  try {
    const addData = await msgClient.doc(docs).set({
      user: "estes",
    });

    // const addData = await msgClient.add({
    //   message: data.message,
    //   room: data.room,
    //   user: data.user,
    //   username: data.username,
    //   createdAt: timeFormat(new Date()),
    //   date: dayFormat(new Date()),
    // });
    return addData;
  } catch (error) {
    console.log(error);
  }
}

getSpecifyMessage();
// addMessage({ text: "Bom dia", intent: "SAUDACAO" });
// getMessages();
getMessageIA();

// Treine e salve o modelo.
async function startBot(msg) {
  await manager.train();
  manager.save();

  const response = await manager.process("pt", msg);

  if (msg === " ") return;

  if (response.answer == null) {
    return io.emit("message_bot", {
      user: "bot",
      message: "Desculpe, não entendi o que você quis dizer",
      time: timeFormat(new Date()),
    });
  }

  io.emit("message_bot", {
    user: "bot",
    message: response.answer,
    time: timeFormat(new Date()),
  });
}

io.on("connection", (socket) => {
  socket.on("message", (data) => {
    // Salvar as mensagens

    startBot(data.message);

    addMsgClient(data.room, data);

    const msgClient = {
      message: data.message,
      room: data.room,
      user: data.user,
      username: data.username,
      time: timeFormat(new Date()),
      date: dayFormat(new Date()),
    };

    socket.emit("message_new", msgClient);
  });
});

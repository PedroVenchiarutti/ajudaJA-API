const { io } = require("./server");
const { NlpManager } = require("node-nlp");
const { firebaseApp } = require("./dbconnectionFirebase");
const { timeFormat, dayFormat } = require("../helpers/newDate");

const manager = new NlpManager({ languages: ["pt"], forcptER: true });
// Adiciona os enunciados e intenções para a NLP

// Criando uma colecancao de dados no Banco de dados Firebase
const messageBot_rsp = firebaseApp.firestore().collection("message_bot_resp");
const messageBot = firebaseApp.firestore().collection("message_bot");

const dayReplace = dayFormat(new Date()).replace(/\//g, "_");

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
// Treine e salve o modelo.
async function startBot(data) {
  if (data.message === " ") return;
  if (data.initial) return;
  await manager.train();
  manager.save();

  const notFoundMessage = "Desculpe, não entendi o que você quis dizer.";

  try {
    const response = await manager.process("pt", data.message.toLowerCase());
    console.log(response);
    // se o bot nao encontrar a mensagem ele retorna a mensagem de not
    if (response.answer == null) {
      await firebaseApp
        .database()
        .ref(data.room)
        .child(dayReplace)
        .push({
          message: notFoundMessage,
          room: data.room,
          user: "bot",
          username: "bot",
          createdAt: timeFormat(new Date()),
          date: dayFormat(new Date()),
        });

      io.emit("message_bot", {
        user: "bot",
        message: notFoundMessage,
        createdAt: timeFormat(new Date()),
        date: dayFormat(new Date()),
      });
    } else {
      await firebaseApp
        .database()
        .ref(data.room)
        .child(dayReplace)
        .push({
          message: response.answer,
          room: data.room,
          user: "bot",
          username: "bot",
          createdAt: timeFormat(new Date()),
          date: dayFormat(new Date()),
        });

      io.emit("message_bot", {
        user: "bot",
        message: response.answer,
        time: timeFormat(new Date()),
      });
      return;
    }
  } catch (error) {
    console.log(error.message);
  }
}

// Adicioanndo a mensagem do usuario no banco de dados
function addMsgClient(collection, data) {
  firebaseApp
    .database()
    .ref(data.room)
    .child(dayReplace)
    .push({
      message: data.message,
      room: data.room,
      user: data.user,
      username: data.username,
      createdAt: timeFormat(new Date()),
      date: dayFormat(new Date()),
    })
    .then(() => {
      return startBot(data);
    })
    .catch((error) => {
      console.log(error.message);
    });
}

io.on("connection", (socket) => {
  getSpecifyMessage();
  getMessageIA();

  socket.on("message", (data) => {
    const msgClient = {
      message: data.message,
      room: data.room,
      user: data.user,
      username: data.username,
      time: timeFormat(new Date()),
      date: dayFormat(new Date()),
    };
    socket.emit("message_new", msgClient);

    if (data.message === "sair") {
      socket.emit("message_new", {
        user: "bot",
        message: "Até mais, espero ter ajudado",
        time: timeFormat(new Date()),
      });
      socket.disconnect();
      return;
    }
    addMsgClient(data.room, data);
  });
});

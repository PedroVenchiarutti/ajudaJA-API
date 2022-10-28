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
async function startBot(msg, username) {
  if (msg === " ") return;
  await manager.train();
  manager.save();

  try {
    const response = await manager.process("pt", msg.toLowerCase());
    console.log(response);

    if (response.answer == null) {
      firebaseApp
        .database()
        .ref(username)
        .child(dayReplace)
        .push({
          user: "bot",
          message: "Desculpe, não entendi o que você quis dizer",
          createdAt: timeFormat(new Date()),
          date: dayFormat(new Date()),
        })
        .then(() => {
          io.emit("message_bot", {
            user: "bot",
            message: "Desculpe, não entendi o que você quis dizer",
            createdAt: timeFormat(new Date()),
            date: dayFormat(new Date()),
          });
        })
        .catch((error) => {
          console.log(error.message);
        });
    } else {
      firebaseApp
        .database()
        .ref(username)
        .child(dayReplace)
        .push({
          message: response.answer,
          user: "bot",
          createdAt: timeFormat(new Date()),
          date: dayFormat(new Date()),
        })
        .then(() => {
          io.emit("message_bot", {
            user: "bot",
            message: response.answer,
            time: timeFormat(new Date()),
          });
          return;
        });
    }
  } catch (error) {
    console.log(error.message);
  }
}

// Adicioanndo a mensagem do usuario no banco de dados
function addMsgClient(collection, data) {
  firebaseApp
    .database()
    .ref(data.username)
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
      return startBot(data.message, data.username);
    })
    .catch((error) => {
      console.log(error.message);
    });
}

// getSpecifyMessage();
// getMessageIA();

io.on("connection", (socket) => {
  getSpecifyMessage();
  getMessageIA();

  socket.on("message", (data) => {
    if (data.message === "Iniciar") {
      // Salvar as mensagens
      socket.emit("message_new", {
        user: "bot",
        message: "Olá, como posso te ajudar?",
        createdAt: timeFormat(new Date()),
        date: dayFormat(new Date()),
      });
    } else {
      const msgClient = {
        message: data.message,
        room: data.room,
        user: data.user,
        username: data.username,
        time: timeFormat(new Date()),
        date: dayFormat(new Date()),
      };
      socket.emit("message_new", msgClient);
    }

    if (data.message === "Sair") {
      socket.emit("message_new", {
        user: "bot",
        message: "Até mais, espero ter ajudado",
        time: timeFormat(new Date()),
      });
      socket.disconnect();
      return;
    }
    if (data.message === "Iniciar") {
      return;
    }
    addMsgClient(data.room, data);
  });
});

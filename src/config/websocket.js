const { io } = require("./server");
const { NlpManager } = require("node-nlp");
const { firebaseApp } = require("./dbconnectionFirebase");
const { add } = require("../controller/userController");
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
  const msgClient = firebaseApp.firestore().collection(`CLIENT_${collection}`);

  try {
    const addData = await msgClient.add({
      message: data.message,
      room: data.room,
      user: data.user,
      username: data.username,
      createdAt: timeFormat(new Date()),
      date: dayFormat(new Date()),
    });
    return addData;
  } catch (error) {
    console.log(error);
  }
}

async function getMsgClient(collection) {
  const msgClient = firebaseApp.firestore().collection(`CLIENT_${collection}`);

  try {
    const snapshot = await msgClient.get();
    const data = snapshot.docs?.map((doc) => doc.data().date);
    const validationData = data?.filter((item, index) => {
      if (item == undefined) return;
      return data.indexOf(item) === index;
    });

    const getMsg = await msgClient
      ?.where("date", "==", validationData[0])
      .get();
    const dataMsg = getMsg.docs?.map((doc) => doc.data());

    console.log(dataMsg);

    io.emit("message_client", dataMsg);
    return validationData;
  } catch (error) {
    console.log(error);
  }
}

getSpecifyMessage();
// addMessage({ text: "Bom dia", intent: "SAUDACAO" });
// getMessages();
getMessageIA();

// getMsgClient("chat01#pedro");

// Treine e salve o modelo.
async function startBot(msg) {
  await manager.train();
  manager.save();

  const response = await manager.process("pt", msg);
  console.log(response);

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
  // socket.on("select_room", (data) => {
  //   socket.join(data.room);

  //   const userInRoom = users.find(
  //     (user) => user.username === data.username && user.room === data.room
  //   );

  //   if (userInRoom) {
  //     userInRoom.socketId = socket.id;
  //   } else {
  //     users.push({
  //       room: data.room,
  //       username: data.user,
  //       socketId: socket.id,
  //     });
  //   }
  // });
  socket.on("message", (data) => {
    // Salvar as mensagens
    console.log(data);

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

    // Enviar para os usuarios da sala
    // todos os usuario da sala recebe
    // io.to(data.room).emit("message_new", message);
    socket.emit("message_new", msgClient);
  });
});

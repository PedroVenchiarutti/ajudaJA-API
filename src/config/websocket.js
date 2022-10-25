const { io } = require("./server");
const { NlpManager } = require("node-nlp");
// const { firebaseApp } = require("./dbconnection");

const manager = new NlpManager({ languages: ["pt"], forcptER: true });
// Adiciona os enunciados e intenções para a NLP

// Criando uma colecancao de dados no Banco de dados Firebase
// const messageBot_rsp = firebaseApp.firestore().collection("message_bot_resp");
// const messageBot = firebaseApp.firestore().collection("message_bot");

// exports.getMessages = async () => {
//   try {
//     const snapshot = await messageBot.get();
//     const data = snapshot.docs.map((doc) => doc.data());
//     return console.log(data);
//   } catch (error) {
//     console.log(error);
//   }
// };

// async function getMessages() {
//   try {
//     const snapshot = await messageBot_rsp.get();
//     const data = snapshot.docs.map((doc) => doc.data());
//     return console.log(data);
//   } catch (error) {
//     console.log(error);
//   }
// }

// async function getSpecifyMessage() {
//   try {
//     const snapshot = await messageBot.get();
//     const data = snapshot.docs.map((doc) => {
//       let msg = doc.data().text;
//       let intent = doc.data().intent;
//       manager.addAnswer("pt", intent, msg);
//     });
//     return data;
//   } catch (error) {
//     console.log(error);
//   }
// }

// async function addMessage({ text, intent }) {
//   try {
//     const addData = await messageBot.add({
//       text: text,
//       intent: intent,
//     });
//   } catch (error) {
//     console.log(error);
//   }
// }
// getSpecifyMessage();
// addMessage();
// getMessages();

// Treino de saudaao oque a pessoa fala
// manager.addDocument("pt", "Bom dia", "SAUDACAO");
manager.addDocument("pt", "que horas sao", "DUVIDA");

// treino de localizacao
// manager.addDocument("pt", "Localizacao", "LOCALIZACAO");
// manager.addDocument("pt", "Referencia", "LOCALIZACAO");

// Treine também o NLP
// manager.addAnswer("pt", "SAUDACAO", "Ola, tudo bem com voce?");
// manager.addAnswer(
//   "pt",
//   "SAUDACAO",
//   "Sou assistente virtual para ajudar no seu dia a dia"
// );

// oque a maquina vai responder
// manager.addAnswer("pt", "DUVIDA", "Gay");

const users = [];

let messages = [];

// Treine e salve o modelo.
async function startBot() {
  await manager.train();
  manager.save();

  const response = await manager.process("pt", "que horas sao? ");
  console.log(response);
}

io.on("connection", (socket) => {
  socket.on("select_room", (data) => {
    socket.join(data.room);

    const userInRoom = users.find(
      (user) => user.username === data.username && user.room === data.room
    );

    if (userInRoom) {
      userInRoom.socketId = socket.id;
    } else {
      users.push({
        room: data.room,
        username: data.user,
        socketId: socket.id,
      });
    }
  });
  socket.on("message", (data) => {
    // Salvar as mensagens
    const message = {
      room: data.room,
      username: data.username,
      text: data.message,
      createdAt: new Date(),
    };

    startBot();
    console.log(message);

    messages.push(message);
    // Enviar para os usuarios da sala
    // todos os usuario da sala recebe
    io.to(data.room).emit("message", message);
  });
});

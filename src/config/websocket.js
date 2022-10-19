const { io } = require("./server");

// io.on("connection", (socket) => {
//   console.log(`User connected: ${socket.id}`);
// });

const users = [];

const messages = [];

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

    console.log(message);

    messages.push(message);
    // Enviar para os usuarios da sala
    // todos os usuario da sala recebe
    io.to(data.room).emit("message", message);
  });
});

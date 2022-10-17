const { io } = require("./server");

// io.on("connection", (socket) => {
//   console.log(`User connected: ${socket.id}`);
// });

const notification = [];

io.on("connection", (socket) => {
  console.log(`User connected: ${socket.id}`);

  socket.join("room1");

  // Recebndo a msg do cliente pelo front-end
  socket.on("chat_message", (data) => {
    console.log(data);
    const message = {
      room: data.room,
      message: data.message,
      user: data.user,
      createdAt: new Date(),
    };
    notification.push(message);

    // Enviando a msg para o front-end
    io.to(data.room).emit("chat_message", message);
  });
});

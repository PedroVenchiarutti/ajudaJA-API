const { io } = require("./server");

// io.on("connection", (socket) => {
//   console.log(`User connected: ${socket.id}`);
// });

io.on("chat_message", (msg) => {
  console.log(msg);
  io.emit("chat_message", msg);
});

io.on("connection", (socket) => {
  console.log(`User connected: ${socket.id}`);
});

const { io } = require("../config/server");

exports.webChat = (req, res) => {
  io.on("chat_message", (msg) => {
    console.log(msg);
    io.emit("chat_message", msg);
  });

  //   io.on("connection", (socket) => {
  //     console.log(`User connected: ${socket.id}`);
  //   });
};

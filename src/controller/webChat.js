const { io } = require("../config/server");

exports.webChat = (req, res) => {
  io.on("chat_message", (msg) => {
    console.log(msg);
    io.emit("chat_message", msg);

    io.on("join_room", (room) => {
      console.log(room);
      io.emit("join_room", room);
    });
  });

  //   io.on("connection", (socket) => {
  //     console.log(`User connected: ${socket.id}`);
  //   });
};

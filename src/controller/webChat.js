const { io } = require("../config/server");

const users = [];

exports.webChat = (req, res) => {

  io.on("connection", (socket) => {
    socket.on("select_room", (data) => {
      console.log(data)
    });
  });


  // io.on("connection", (socket) => {
  //   socket.on("select_room", (data) => {
  //     console.log(data);
  //     socket.join(data.room);

  //     const userInRoom = messages.find(
  //       (user) => user.username === data.username && user.room === data.room
  //     );

  //     if (userInRoom) {
  //       userInRoom.socketId = socket.id;
  //     } else {
  //       users.push({
  //         room: data.room,
  //         message: data.message,
  //         username: data.user,
  //         socketId: socket.id,
  //       });
  //     }
  //     console.log(users);
  //   });
  // });

  //   io.on("connection", (socket) => {
  //     console.log(`User connected: ${socket.id}`);
  //   });


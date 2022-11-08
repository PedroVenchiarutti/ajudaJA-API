const { server } = require("./src/config/server");
require("./src/config/websocket");
const PORT = process.env.PORT;

server.listen(PORT || 3000, () => {
  console.log(`Server is running on port ${PORT}.`);
});

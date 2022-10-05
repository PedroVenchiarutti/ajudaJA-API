const server = require("../src/config/server");

const PORT = process.env.PORT;

server.listen(PORT || 3000, () => {
  console.log(`Server is running on port ${PORT}.`);
});

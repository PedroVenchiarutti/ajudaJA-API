const { app } = require("../src/config/server");

const PORT = process.env.PORT;

app.listen(PORT || 3000, () => {
  console.log(`Server is running on port ${PORT}.`);
});

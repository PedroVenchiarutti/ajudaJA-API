const bcrypt = require("bcrypt");
const salt = 10;

exports.generateHash = async (password) => {
  const hash = await bcrypt.hashSync(password, salt);
  return hash;
};

exports.compareHash = async (password, hash) => {
  const result = await bcrypt.compareSync(password, hash);
  return result;
};

exports.getHash = async (password) => {
  const hash = await bcrypt.hashSync(password, salt);
  return hash;
};

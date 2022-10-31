const moment = require("moment");

const timeFormat = (date) => {
  const time = moment(date).format("HH:mm");
  return time;
};

const dayFormat = (date) => {
  const day = moment(date).format("DD/MM/YYYY");
  return day;
};

module.exports = { timeFormat, dayFormat };

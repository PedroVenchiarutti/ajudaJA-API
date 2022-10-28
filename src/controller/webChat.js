const { firebaseApp } = require("../config/dbconnectionFirebase");
const { timeFormat, dayFormat } = require("../helpers/newDate");

exports.getMsgClient = () => async (req, res) => {
  const section = req.params.id;

  let date = dayFormat(new Date()).replace(/\//g, "_");

  const msgClient = firebaseApp.database().ref(section).child(date);

  try {
    const dataNew = [];

    const snapshot = await msgClient.on("value", (snapshot) => {
      snapshot?.forEach((childSnapshot) => {
        const data = childSnapshot.val();
        dataNew.push(data);
      });
      res.status(200).json(dataNew);
    });
  } catch (error) {
    console.log(error);
  }
};

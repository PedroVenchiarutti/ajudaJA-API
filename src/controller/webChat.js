const { firebaseApp } = require("../config/dbconnectionFirebase");
const { timeFormat, dayFormat } = require("../helpers/newDate");

exports.getMsgClient = (collection) => async (req, res) => {
  const msgClient = firebaseApp.firestore().collection(`CLIENT_${collection}`);

  try {
    const snapshot = await msgClient.get();
    const data = snapshot.docs?.map((doc) => doc.data().date);
    
    const validationData = data?.filter((item, index) => {
      if (item == undefined) return;
      return data.indexOf(item) === index;
    });

    const getMsg = await msgClient
      ?.where("date", "==", validationData[0])
      .get();
    const dataMsg = getMsg.docs?.map((doc) => doc.data());

    // io.emit("message_client", dataMsg);
    res.status(200).json(dataMsg);
  } catch (error) {
    console.log(error);
  }
};

const { firebaseApp } = require("../config/dbconnectionFirebase");
const { timeFormat, dayFormat } = require("../helpers/newDate");

exports.getMsgClient = (collection) => async (req, res) => {
  if (!collection) return;

  const msgClient = firebaseApp.firestore().collection(`CLIENT_${collection}`);

  let data = new Date();

  try {
    const snapshot = await msgClient.get();
    const data = snapshot.docs?.map((doc) => doc.data().date);

    const validationData = data?.filter((item, index) => {
      if (item == undefined) return;

      return data.indexOf(item) === index;
    });

    const dataFilter = validationData?.map((item) => {
      if (item == undefined) return;
      if (item == dayFormat(new Date())) return item;
    });

    const dataFilter2 = dataFilter?.filter((item) => {
      if (item == undefined) return;

      return item;
    });

    const getMsg = await msgClient
      .where("createdAt", ">", "00:00:00")
      .orderBy("createdAt", "asc")
      .get();

    // const filterHour = getMsg.docs?.map((doc) => {
    //   if (doc.data().createdAt == undefined) return;

    //   console.log(doc.data().createdAt);
    // });

    const dataMsg = await getMsg.docs?.map((doc) => {
      return doc.data();
    });

    // io.emit("message_client", dataMsg);
    res.status(200).json(dataMsg);
  } catch (error) {
    console.log(error);
  }
};

exports.botMessage = (collection) => async (req, res) => {};

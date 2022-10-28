const { firebaseApp } = require("../config/dbconnectionFirebase");
const { v1: uuidv1, v4: uuidv4 } = require("uuid");

// Mensage que o vai treinar o bot para responder
const messageBot_rsp = firebaseApp.firestore().collection("message_bot_resp");

// Mensagen que o bot vai responder
const messageBot = firebaseApp.firestore().collection("message_bot");

// Adicionando mensagens para o bot responder
exports.addMessage = async (req, res) => {
  const { text, intent } = req.body;

  try {
    if (!text || !intent) {
      return res.status(400).json({ message: "Dados inválidos" });
    }

    const addData = await messageBot.add({
      id: uuidv4(),
      text: text,
      intent: intent,
    });
    res.status(200).json({ message: "Mensagem adicionada com sucesso" });
    return addData;
  } catch (error) {
    res.status(500).json({ message: "Erro ao adicionar mensagem" });
  }
};

// Pegando mensagens do bot
exports.addResposta = async (req, res) => {
  const { text, intent } = req.body;

  try {
    if (!text || !intent) {
      return res.status(400).json({ message: "Dados inválidos" });
    }

    const addData = await messageBot_rsp.add({
      text: text,
      intent: intent,
    });
    res.status(200).json({ message: "Mensagem adicionada com sucesso" });
    return addData;
  } catch (error) {
    res.status(500).json({ message: "Erro ao adicionar mensagem" });
  }
};

// Listando mensagens do bot pela collection
exports.getMessages = async (req, res) => {
  const collection = req.body.collection;
  console.log(collection);
  const messages = firebaseApp.firestore().collection(collection);

  try {
    const snapshot = await messages.get();
    const data = snapshot.docs.map((doc) => doc.data());
    res.status(200).json({ message: data });
  } catch (error) {
    res.status(500).json({ message: "Erro ao buscar mensagens" });
  }
};

//Deletando mensagens do bot pela collection, e pelo uuid
exports.deleteMessage = async (req, res) => {
  const { id, collection } = req.body;

  const messages = firebaseApp.firestore().collection(collection);

  try {
    const snapshot = await messages.doc(id).delete();
    res.status(200).json({ message: "Mensagem deletada com sucesso" });
  } catch (error) {
    res.status(500).json({ message: "Erro ao deletar mensagem" });
  }
};


const { firebaseApp } = require("../config/dbconnectionFirebase");
const { v1: uuidv1, v4: uuidv4 } = require("uuid");
const dotenv = require("dotenv").config();

// Mensage que o vai treinar o bot para responder
const messageBot_rsp = firebaseApp
  .firestore()
  .collection(process.env.BD_BOT_RES);

// Mensagen que o bot vai responder
const messageBot = firebaseApp.firestore().collection(process.env.BD_BOT);

// Adicionando mensagens para o bot responder
exports.addMessage = async (req, res) => {
  const { text, intent } = req.body;

  /*
            #swagger.tags = ['Private / IA']
            #swagger.security = [{
            "bearerAuth": []
          },
        ]
     */

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
  /*
            #swagger.tags = ['Private / IA']
            #swagger.security = [{
            "bearerAuth": []
          },
        ]
     */

  const { text, intent } = req.body;

  try {
    if (!text || !intent) {
      return res.status(400).json({ message: "Dados inválidos" });
    }

    const addData = await messageBot_rsp.add({
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

// Listando mensagens do bot pela collection
exports.getMessages = async (req, res) => {
  /*
            #swagger.tags = ['Private / IA']
            #swagger.security = [{
            "bearerAuth": []
          },
        ]
     */

  const collection = req.body.collection;
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
  /*
            #swagger.tags = ['Private / IA']
            #swagger.security = [{
            "bearerAuth": []
          },
        ]
     */

  const { id, collection } = req.body;

  const messages = firebaseApp.firestore().collection(collection);

  try {
    const snapshot = await messages.doc(id).delete();
    res.status(200).json({ message: "Mensagem deletada com sucesso" });
  } catch (error) {
    res.status(500).json({ message: "Erro ao deletar mensagem" });
  }
};

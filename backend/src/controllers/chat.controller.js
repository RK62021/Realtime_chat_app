const asynchandler = require('../utils/asynchandler');

class ChatController {
  static createChat = asynchandler(async (req, res) => { // create a new chat group or direct chat
    // Data that is needed to create a chat
    const { type, name, members } = req.body;
    const chat = chatServices.createChat(req.user.id, type, name, members);
    res.status(201).json({ chat });
  });

  static getChats = asynchandler(async (req, res) => {  // get chats for the logged-in user
    const chats = await chatServices.getUserChats(req.user.id);
    res.status(200).json({ chats });
  });
}

module.exports = ChatController;

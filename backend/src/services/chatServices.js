const db = require('../models/index.js');
const {User , Chat, ChatMember} = db;
const { Op } = require('sequelize');

class chatServices {
  static async createChat(userId, type, name, members) {
    const chat = await Chat.create({ type, name , created_by: userId });
    await ChatMember.bulkCreate(
      members.map((memberId) => ({ chatId: chat.id, userId: memberId }))
    );
    return chat;
  }

  static async getUserChats(userId) {
    const chats = await Chat.findAll({
      include: [
        {
          model: ChatMember,
          where: { userId },
        },
      ],
    });
    return chats;
  }
}
module.exports = chatServices;
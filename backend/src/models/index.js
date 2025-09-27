'use strict';

const fs = require('fs');
const path = require('path');
const Sequelize = require('sequelize');
const process = require('process');
const basename = path.basename(__filename);
const env = process.env.NODE_ENV || 'development';
const config = require(__dirname + '/../config/config.json')[env];
const db = {};

let sequelize;
if (config.use_env_variable) {
  sequelize = new Sequelize(process.env[config.use_env_variable], config);
} else {
  sequelize = new Sequelize(
    config.database,
    config.username,
    config.password,
    config
  );
}

// Import all models
fs.readdirSync(__dirname)
  .filter(
    (file) =>
      file.indexOf('.') !== 0 &&
      file !== basename &&
      file.slice(-3) === '.js' &&
      file.indexOf('.test.js') === -1
  )
  .forEach((file) => {
    const model = require(path.join(__dirname, file))(
      sequelize,
      Sequelize.DataTypes
    );
    db[model.name] = model;
  });

// Run associate method if exists
Object.keys(db).forEach((modelName) => {
  if (db[modelName].associate) {
    db[modelName].associate(db);
  }
});

// === Explicit associations ===

// User
if (db.User) {
  db.User.hasMany(db.AuthToken, { foreignKey: 'user_id', as: 'authTokens' });
  db.User.hasMany(db.Message, { foreignKey: 'sender_id', as: 'sentMessages' });
  db.User.hasMany(db.ChatMember, {
    foreignKey: 'user_id',
    as: 'chatMemberships',
  });
  db.User.hasMany(db.ChatStatus, { foreignKey: 'user_id', as: 'statuses' });
  db.User.hasMany(db.Notification, {
    foreignKey: 'user_id',
    as: 'notifications',
  });
  db.User.hasMany(db.Call, { foreignKey: 'caller_id', as: 'callsMade' });
  db.User.hasMany(db.CallParticipant, {
    foreignKey: 'user_id',
    as: 'callParticipations',
  });
}

// Chat
if (db.Chat) {
  db.Chat.hasMany(db.Message, { foreignKey: 'chat_id', as: 'messages' });
  db.Chat.hasMany(db.ChatMember, { foreignKey: 'chat_id', as: 'members' });
  db.Chat.hasMany(db.ChatStatus, { foreignKey: 'chat_id', as: 'statuses' });
  db.Chat.hasMany(db.Call, { foreignKey: 'chat_id', as: 'calls' });
  db.Chat.belongsTo(db.User, { foreignKey: 'created_by', as: 'creator' });
}

// Message
if (db.Message) {
  db.Message.hasMany(db.Attachment, {
    foreignKey: 'message_id',
    as: 'attachments',
  });
  db.Message.hasMany(db.MessageReaction, {
    foreignKey: 'message_id',
    as: 'reactions',
  });
  db.Message.belongsTo(db.Chat, { foreignKey: 'chat_id', as: 'chat' });
  db.Message.belongsTo(db.User, { foreignKey: 'sender_id', as: 'sender' });
}

// Attachment
if (db.Attachment) {
  db.Attachment.belongsTo(db.Message, {
    foreignKey: 'message_id',
    as: 'message',
  });
}

// MessageReaction
if (db.MessageReaction) {
  db.MessageReaction.belongsTo(db.Message, {
    foreignKey: 'message_id',
    as: 'message',
  });
  db.MessageReaction.belongsTo(db.User, { foreignKey: 'user_id', as: 'user' });
}

// ChatMember
if (db.ChatMember) {
  db.ChatMember.belongsTo(db.Chat, { foreignKey: 'chat_id', as: 'chat' });
  db.ChatMember.belongsTo(db.User, { foreignKey: 'user_id', as: 'user' });
}

// ChatStatus
if (db.ChatStatus) {
  db.ChatStatus.belongsTo(db.Chat, { foreignKey: 'chat_id', as: 'chat' });
  db.ChatStatus.belongsTo(db.User, { foreignKey: 'user_id', as: 'user' });
}

// Notification
if (db.Notification) {
  db.Notification.belongsTo(db.User, { foreignKey: 'user_id', as: 'user' });
  db.Notification.belongsTo(db.Message, {
    foreignKey: 'message_id',
    as: 'message',
  });
}

// Call
if (db.Call) {
  db.Call.belongsTo(db.Chat, { foreignKey: 'chat_id', as: 'chat' });
  db.Call.belongsTo(db.User, { foreignKey: 'caller_id', as: 'caller' });
  db.Call.hasMany(db.CallParticipant, {
    foreignKey: 'call_id',
    as: 'participants',
  });
}

// CallParticipant
if (db.CallParticipant) {
  db.CallParticipant.belongsTo(db.Call, { foreignKey: 'call_id', as: 'call' });
  db.CallParticipant.belongsTo(db.User, { foreignKey: 'user_id', as: 'user' });
}

db.sequelize = sequelize;
db.Sequelize = Sequelize;

module.exports = db;

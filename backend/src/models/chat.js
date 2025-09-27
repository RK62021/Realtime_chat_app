'use strict';
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Chat extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // Chat belongs to creator (User)
      Chat.belongsTo(models.User, { foreignKey: 'created_by', as: 'creator' });

      // Chat has many messages
      Chat.hasMany(models.Message, { foreignKey: 'chat_id', as: 'messages' });

      // Chat has many members
      Chat.hasMany(models.ChatMember, { foreignKey: 'chat_id', as: 'members' });

      // Chat has many statuses (online/offline/typing)
      Chat.hasMany(models.ChatStatus, {
        foreignKey: 'chat_id',
        as: 'statuses',
      });

      // Chat has many calls
      Chat.hasMany(models.Call, { foreignKey: 'chat_id', as: 'calls' });
    }
  }
  Chat.init(
    {
      type: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          isIn: [['direct', 'group']], // matches your schema check constraint
        },
      },
      name: {
        type: DataTypes.STRING(150),
        allowNull: true,
      },
      created_by: {
        type: DataTypes.INTEGER,
        allowNull: true,
      },
    },
    {
      sequelize,
      modelName: 'Chat',
      tableName: 'Chats',
      timestamps: true, // createdAt & updatedAt
      updatedAt: 'updatedAt',
      createdAt: 'createdAt',
    }
  );
  return Chat;
};

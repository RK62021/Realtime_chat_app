'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Message extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Message.belongsTo(models.Chat, { foreignKey: 'chat_id' });
      Message.belongsTo(models.User, { foreignKey: 'sender_id', as: 'sender' });
    }
  }
  Message.init({
     chat_id: { type: DataTypes.INTEGER, allowNull: false },
      sender_id: { type: DataTypes.INTEGER, allowNull: false },
      content: { type: DataTypes.TEXT,  },
      is_deleted: { type: DataTypes.BOOLEAN, defaultValue: false },
      is_edited: { type: DataTypes.BOOLEAN, defaultValue: false },
      sent_at: { type: DataTypes.DATE, defaultValue: DataTypes.NOW },
      edited_at: DataTypes.DATE,
  }, {
    sequelize,
    modelName: 'Message',
    tableName: 'Messages',
    timestamps: true,
    createdAt: 'createdAt',
    updatedAt: 'updatedAt',
  });
  return Message;
};
'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class ChatMember extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      ChatMember.belongsTo(models.Chat, { foreignKey: 'chat_id' });
      ChatMember.belongsTo(models.User, { foreignKey: 'user_id' });
    }
  }
  ChatMember.init({
    chat_id: {  type: DataTypes.INTEGER , allowNull: false },
    user_id: {  type: DataTypes.INTEGER , allowNull: false },
    role: { type: DataTypes.STRING , defaultValue: "member" },
    joined_at: { type: DataTypes.DATE , defaultValue: DataTypes.NOW },
  }, {
    sequelize,
    modelName: 'ChatMember',
    tableName: 'ChatMembers',
    timestamps: true,
    createdAt : "createdAt",
    updatedAt:"updatedAt"
  });
  return ChatMember;
};
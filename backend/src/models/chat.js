'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Chat extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Chat.hasMany(models.Message, { foreignKey: 'chat_id' });
      Chat.hasMany(models.ChatMember, { foreignKey: 'chat_id' });
      Chat.belongsTo(models.User, { foreignKey: 'created_by', as: 'creator' } );

    }
  }
  Chat.init({
    type: { type: DataTypes.STRING , allowNull: false },
    name:{ type: DataTypes.STRING , allowNull: true },
    created_by: { type: DataTypes.INTEGER , allowNull: false },


  }, {
    sequelize,
    modelName: 'Chat',
    tableName: 'Chats',
    timestamps: true,
    createdAt : "createdAt",
    updatedAt:"updatedAt"
  });
  return Chat;
};
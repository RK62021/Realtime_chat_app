'use strict';
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class ChatStatus extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here

      // A ChatStatus belongs to a User
      ChatStatus.belongsTo(models.User, {
        foreignKey: 'user_id',
        onDelete: 'CASCADE',
      });

      // A ChatStatus belongs to a Chat
      ChatStatus.belongsTo(models.Chat, {
        foreignKey: 'chat_id',
        onDelete: 'CASCADE',
      });
    }
  }
  ChatStatus.init(
    {
      chat_id: { type: DataTypes.INTEGER, allowNull: false },
      user_id: { type: DataTypes.INTEGER, allowNull: false },
      status: {
        type: DataTypes.STRING(20),
        allowNull: false,
        validate: { isIn: [['online', 'offline', 'typing', 'recording']] },
      },
      updated_at: { type: DataTypes.DATE, defaultValue: DataTypes.NOW },
    },
    {
      sequelize,
      modelName: 'ChatStatus',
      tableName: 'ChatStatuses',
      timestamps: true,
      createdAt: 'createdAt',
      updatedAt: 'updatedAt',
    }
  );
  return ChatStatus;
};

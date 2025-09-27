'use strict';
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class MessageReaction extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here

      // Each reaction belongs to a specific message
      MessageReaction.belongsTo(models.Message, {
        foreignKey: 'message_id',
        onDelete: 'CASCADE',
      });

      // Each reaction is made by a specific user
      MessageReaction.belongsTo(models.User, {
        foreignKey: 'user_id',
        onDelete: 'CASCADE',
      });
    }
  }
  MessageReaction.init(
    {
      message_id: { type: DataTypes.INTEGER, allowNull: false },
      user_id: { type: DataTypes.INTEGER, allowNull: false },
      reaction_type: { type: DataTypes.STRING(20), allowNull: false },
      created_at: { type: DataTypes.DATE, defaultValue: DataTypes.NOW },
    },
    {
      sequelize,
      modelName: 'MessageReaction',
      tableName: 'MessageReactions',
      timestamps: true,
      updatedAt: 'updatedAt',
      createdAt: 'createdAt',
    }
  );
  return MessageReaction;
};

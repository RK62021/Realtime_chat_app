'use strict';
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Call extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here

      // A call belongs to a chat
      Call.belongsTo(models.Chat, {
        foreignKey: 'chat_id',
        onDelete: 'SET NULL',
      });

      // A call is initiated by a user (caller)
      Call.belongsTo(models.User, {
        as: 'Caller',
        foreignKey: 'caller_id',
        onDelete: 'CASCADE',
      });

      // A call can have many participants
      Call.hasMany(models.CallParticipant, {
        foreignKey: 'call_id',
        onDelete: 'CASCADE',
      });

      // A call can have many notifications
      Call.hasMany(models.Notification, {
        foreignKey: 'call_id',
        onDelete: 'CASCADE',
      });
    }
  }
  Call.init(
    {
      chat_id: { type: DataTypes.INTEGER, allowNull: false },
      caller_id: { type: DataTypes.INTEGER, allowNull: true },
      call_type: {
        type: DataTypes.STRING(20),
        allowNull: false,
        validate: { isIn: [['voice', 'video']] },
      },
      status: {
        type: DataTypes.STRING(20),
        allowNull: false,
        validate: { isIn: [['ringing', 'accepted', 'ended', 'missed']] },
      },
      started_at: { type: DataTypes.DATE, defaultValue: DataTypes.NOW },
      ended_at: { type: DataTypes.DATE },
    },
    {
      sequelize,
      modelName: 'Call',
      tableName: 'Calls',
      timestamps: true,
      createdAt: 'createdAt',
      updatedAt: 'updatedAt',
    }
  );
  return Call;
};

'use strict';
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Notification extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here

      // A notification belongs to a user
      Notification.belongsTo(models.User, {
        foreignKey: 'user_id',
        onDelete: 'CASCADE',
      });

      // A notification may belong to a message (optional)
      Notification.belongsTo(models.Message, {
        foreignKey: 'message_id',
        onDelete: 'CASCADE',
      });
    }
  }
  Notification.init(
    {
      user_id: { type: DataTypes.INTEGER, allowNull: false },
      message_id: { type: DataTypes.INTEGER, allowNull: true },
      type: { type: DataTypes.STRING(50), allowNull: false },
      is_read: { type: DataTypes.BOOLEAN, defaultValue: false },
      created_at: { type: DataTypes.DATE, defaultValue: DataTypes.NOW },
      updated_at: { type: DataTypes.DATE, defaultValue: DataTypes.NOW },
    },
    {
      sequelize,
      modelName: 'Notification',
      tableName: 'Notifications',
      underscored: true,
      timestamps: true,
      createdAt: 'created_at',
      updatedAt: 'updated_at',
    }
  );
  return Notification;
};

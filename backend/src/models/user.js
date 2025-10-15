'use strict';
const { Model, DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  class User extends Model {
    static associate(models) {
      // Associations
      User.hasMany(models.AuthToken, { foreignKey: 'user_id', onDelete: 'CASCADE' });
      // User.hasMany(models.Message, { foreignKey: 'sender_id', onDelete: 'CASCADE' });
      // User.hasMany(models.ChatMember, { foreignKey: 'user_id', onDelete: 'CASCADE' });
      // User.hasMany(models.CallParticipant, { foreignKey: 'user_id', onDelete: 'CASCADE' });
      // User.hasMany(models.MessageReaction, { foreignKey: 'user_id', onDelete: 'CASCADE' });
      // User.hasMany(models.Notification, { foreignKey: 'user_id', onDelete: 'CASCADE' });
    }
  }

  User.init(
    {
      name: { type: DataTypes.STRING, allowNull: false },
      email: { type: DataTypes.STRING, allowNull: false, unique: true, validate: { isEmail: true } },
      username: { type: DataTypes.STRING, allowNull: true, unique: true },
      password_hash: { type: DataTypes.TEXT, allowNull: false },
      profile_pic: { type: DataTypes.TEXT },
      status_message: { type: DataTypes.TEXT, defaultValue: "Hey there! I am using ChatApp." },
      is_online: { type: DataTypes.BOOLEAN, defaultValue: false },
      last_seen: { type: DataTypes.DATE },
      oauth_provider: { type: DataTypes.STRING },
      oauth_id: { type: DataTypes.STRING },
    },
    {
      sequelize,
      modelName: 'User',
      tableName: 'Users',
      timestamps: true,
      createdAt: 'createdAt',
      updatedAt: 'updatedAt',
    }
  );

  return User;
};

'use strict';
const { Model, DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  class User extends Model {
    /**
     * Helper method for defining associations.
     * This method is called automatically by `models/index.js`.
     */
    static associate(models) {
      // One user can have many auth tokens
      User.hasMany(models.AuthToken, { foreignKey: 'user_id', onDelete: 'CASCADE' });
      
      // One user can send many messages
      User.hasMany(models.Message, { foreignKey: 'sender_id', onDelete: 'CASCADE' });
      
      // One user can belong to many chat members
      User.hasMany(models.ChatMember, { foreignKey: 'user_id', onDelete: 'CASCADE' });
      
      // One user can participate in many calls
      User.hasMany(models.CallParticipant, { foreignKey: 'user_id', onDelete: 'CASCADE' });
      
      // One user can react to many messages
      User.hasMany(models.MessageReaction, { foreignKey: 'user_id', onDelete: 'CASCADE' });
      
      // One user can have many notifications
      User.hasMany(models.Notification, { foreignKey: 'user_id', onDelete: 'CASCADE' });
    }
  }

  User.init({
    name: { 
      type: DataTypes.STRING, 
      allowNull: false 
    },
    email: { 
      type: DataTypes.STRING, 
      allowNull: false, 
      unique: true,
      validate: { isEmail: { msg: 'Invalid email address' } }
    },
    username: { 
      type: DataTypes.STRING, 
      allowNull: false, 
      unique: true 
    },
    password_hash: { 
      type: DataTypes.TEXT, 
      allowNull: false 
    },
    profile_pic: DataTypes.TEXT,
    status_message: { 
      type: DataTypes.TEXT, 
      defaultValue: "Hey there! I am using ChatApp." 
    },
    is_online: { 
      type: DataTypes.BOOLEAN, 
      defaultValue: false 
    },
    last_seen: DataTypes.DATE,
    oauth_provider: DataTypes.STRING,
    oauth_id: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'User',
    tableName: 'Users',
    timestamps: true
  });

  return User;
};

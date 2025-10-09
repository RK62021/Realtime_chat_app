'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class AuthToken extends Model {
    /**
     * Define associations here.
     */
    static associate(models) {
      // Each AuthToken belongs to a User
      AuthToken.belongsTo(models.User, { foreignKey: 'user_id', onDelete: 'CASCADE', as: 'user' });
    }
  }

  AuthToken.init(
    {
      user_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      refresh_token: {
        type: DataTypes.TEXT,
        allowNull: false,
        unique: true,
      },
      expires_at: {
        type: DataTypes.DATE,
        allowNull: false, // you should set this manually when creating a token
      },
    },
    {
      sequelize,
      modelName: 'AuthToken',
      tableName: 'AuthTokens',
      timestamps: true,
      createdAt: 'createdAt',
      updatedAt: 'updatedAt',
    }
  );

  return AuthToken;
};

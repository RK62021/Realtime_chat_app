'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class AuthToken extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      AuthToken.belongsTo(models.User, { foreignKey: 'user_id' , onDelete: 'CASCADE' });
    }
  }
  AuthToken.init({
    user_id: { type: DataTypes.INTEGER, allowNull: false},
    refresh_token: { type: DataTypes.TEXT, allowNull: false, unique: true },
    expires_at: { type: DataTypes.DATE, allowNull: false, defaultValue: Sequelize.NOW }
  }, {
    sequelize,
    modelName: 'AuthToken',
    timestamps: true,
    tableName: 'auth_tokens',
  });
  return AuthToken;
};
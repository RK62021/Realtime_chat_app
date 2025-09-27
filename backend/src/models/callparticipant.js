'use strict';
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class CallParticipant extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      // Many call participants belong to one call
      CallParticipant.belongsTo(models.Call, {
        foreignKey: 'call_id',
        onDelete: 'CASCADE',
      });
      // Many call participants belong to one user
      CallParticipant.belongsTo(models.User, {
        foreignKey: 'user_id',
        onDelete: 'CASCADE',
      });
    }
  }
  CallParticipant.init(
    {
      call_id: { type: DataTypes.INTEGER, allowNull: false },
      user_id: { type: DataTypes.INTEGER, allowNull: false },
      joined_at: { type: DataTypes.DATE, defaultValue: DataTypes.NOW },
      left_at: { type: DataTypes.DATE },
    },
    {
      sequelize,
      modelName: 'CallParticipant',
      tableName: 'CallParticipants',
      timestamps: true,
      createdAt: 'createdAt',
      updatedAt: 'updatedAt',
    }
  );
  return CallParticipant;
};

'use strict';
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Attachment extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here

      // One attachment belongs to one message
      Attachment.belongsTo(models.Message, {
        foreignKey: 'message_id',
        onDelete: 'CASCADE',
      });
    }
  }
  Attachment.init(
    {
      message_id: { type: DataTypes.INTEGER, allowNull: false },
      file_url: { type: DataTypes.TEXT, allowNull: false },
      file_type: { type: DataTypes.STRING(50), allowNull: true },
      size: { type: DataTypes.BIGINT, allowNull: true },
      created_at: { type: DataTypes.DATE, defaultValue: DataTypes.NOW },
    },
    {
      sequelize,
      modelName: 'Attachment',
      tableName: 'Attachments',
      timestamps: true,
      createdAt: 'created_at',
      updatedAt: 'updated_at',
    }
  );
  return Attachment;
};

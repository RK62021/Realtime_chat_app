'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('ChatMembers', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      chat_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'Chats',
          key: 'id'
        },
        onDelete: 'CASCADE'
      },
      user_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'Users',
          key: 'id'
        },
        onDelete: 'CASCADE'
      },
      role: {
        type: Sequelize.STRING,
        allowNull: false,
        defaultValue: 'member'
      },
      joined_at: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.fn('NOW')
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.fn('NOW')

      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.fn('NOW')

      }
    });
    await queryInterface.addConstraint('ChatMembers', {
      type: 'unique',
      fields: ['chat_id', 'user_id'],
    });

    await queryInterface.addIndex('ChatMembers', ['user_id']);

  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('ChatMembers');
  }
};
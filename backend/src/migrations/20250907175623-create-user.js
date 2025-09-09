'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('Users', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      name: {
        type: Sequelize.STRING,
        allowNull: false
      },
      email: {
        type: Sequelize.STRING,
        allowNull: false,
        unique: true
      },
      username: {
        type: Sequelize.STRING,
        allowNull: false,
        unique: true
      },
      password_hash: {
        type: Sequelize.TEXT,
        allowNull: false,
      },
      profile_pic: {
        type: Sequelize.TEXT
      },
      status_message: {
        type: Sequelize.TEXT,
        defaultValue: "Hey there! I am using ChatApp."
      },
      is_online: {
        type: Sequelize.BOOLEAN,
        defaultValue: false
      },
      last_seen: {
        type: Sequelize.DATE
      },
      oauth_provider: {
        type: Sequelize.STRING
      },
      oauth_id: {
        type: Sequelize.STRING
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.NOW
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.NOW
      }
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('Users');
  }
};
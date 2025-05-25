// seeders/YYYYMMDDHHMMSS-add-initial-categories.js
'use strict';
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.bulkInsert('Categories', [
      { name: 'Work', createdAt: new Date(), updatedAt: new Date() },
      { name: 'Personal', createdAt: new Date(), updatedAt: new Date() },
      { name: 'Health', createdAt: new Date(), updatedAt: new Date() },
      { name: 'Shopping', createdAt: new Date(), updatedAt: new Date() }
    ], {});
  },
  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete('Categories', null, {});
  }
};
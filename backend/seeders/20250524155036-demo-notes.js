'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.bulkInsert('Notes', [
      {
        title: 'Groceries List',
        content: 'Buy milk, eggs, and bread.',
        isArchived: false,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        title: 'Meeting Notes',
        content: 'Discussed API integration plans.',
        isArchived: true,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        title: 'Book to Read',
        content: 'Atomic Habits by James Clear.',
        isArchived: false,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        title: 'Take dog for a walk',
        content: 'Do not forget her toys',
        isArchived: false,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        title: 'Clean house',
        content: 'Deep clean kitchen',
        isArchived: true,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ]);
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete('Notes', null, {});
  },
};

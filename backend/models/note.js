'use strict';

module.exports = (sequelize, DataTypes) => {
  const Note = sequelize.define('Note', {
    title: DataTypes.STRING,
    content: DataTypes.TEXT,
    isArchived: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    }
  }, {});
  Note.associate = function(models){
    Note.belongsTo(models.Category, {
      foreignKey: 'categoryId',
      as: 'category'
    });
  };
    return Note;
  };
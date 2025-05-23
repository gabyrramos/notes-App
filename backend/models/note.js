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
    return Note;
  };
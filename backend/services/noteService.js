const { Note } = require('../models');

const createNote = async (data)=>{
return await Note.create(data);
};

const getAllNotes = async ({ filterArchived = null } = {}) => { 
    const whereClause = {};

    if (filterArchived === true) {
        whereClause.isArchived = true;
    } else if (filterArchived === false) {
        whereClause.isArchived = false;
    }
    const notes = await Note.findAll({
        where: whereClause 
    });
    return notes;
};

const getNoteById = async(id) =>{
    return await Note.findByPk(id);
};

const updateNote = async(id, data) =>{
const note = await Note.findByPk(id)
    if(!note) {
        return null;
    }
    const updatedNote=  await note.update(data);
    return updatedNote;
};

const deleteNote = async(id) =>{
    const note = await Note.findByPk(id)
    if(!note) {
        return null;
    }
    await note.destroy();
    return true;
};

const archivedNote = async(id) =>{
    const note = await Note.findByPk(id)
    if(!note){
        return null;
    }
    note.isArchived = !note.isArchived;
    const updatedNote = await note.save();
    return updatedNote;
};


module.exports = {
    createNote,
    getAllNotes,
    getNoteById,
    updateNote,
    deleteNote,
    archivedNote
};
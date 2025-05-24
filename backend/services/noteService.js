const { Note } = require('../models/note');

const createNote = async (data)=>{
return await Note.create(data);
};

const getAllNotes = async (archived=false)=>{
    return await Note.findAll({ where: {isArchived: archived} });
}

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


const getArchivedNotes = async(archived=true)=>{
    const notes = await Note.findAll({where: {isArchived: archived}});
    return notes;
};

module.exports = {
    createNote,
    getAllNotes,
    getNoteById,
    updateNote,
    deleteNote,
    archivedNote,
    getArchivedNotes
};
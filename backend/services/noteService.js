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

const updateNote = async(id) =>{
const note = await Note.findByPk(id)
    if(!note) return("Note was not found");
    return await note.update(data);
};

const deleteNote = async(id) =>{
    const note = await Note.findByPk(id)
    if(!note) return("Note was not found");
    await note.destroy();
    return true;
};

const archivedNote = async(id) =>{
    const note = await Note.findByPk(id)
    if(!note) return(Null);
    note.isArchived = !note.isArchived;
    return await note.save();
};


const getArchivedNotes = async(archived=true)=>{
    const notes = await Note.findAll({where: {isArchived: archived}});
    if(!notes) return("There are not archived notes");
    return await notes;
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
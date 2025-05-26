const { Category, Note } = require('../models');

const createCategory = async (name)=>{
    return await Category.create({name});
};

const assignCategory = async(noteId, categoryId)=>{
    const note = await Note.findByPk(noteId);
    const category = await Category.findByPk(categoryId);
    if(!note || !category){
        return null;
    }
    await note.update({ categoryId: category.id });
    return note;
};

const unassignCategory = async(noteId, categoryId) => {
    const note = await Note.findByPk(noteId);
    if(!note){
        return null;
    }
    await note.update({categoryId: null});
    return true;
};

const getNotesByCategory = async(categoryName) =>{
    const category = await Category.findOne({ where: { name :categoryName }, include: [{ model: Note, as: 'notes'}] });
    if(!category){
        return[];
    };
    return category.notes;
}

const getAllCategories = async() =>{
    const categories = await Category.findAll()
    return categories;
}

module.exports = {
    createCategory,
    assignCategory,
    unassignCategory,
    getNotesByCategory,
    getAllCategories
};
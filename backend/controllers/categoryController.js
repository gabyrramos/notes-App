const e = require('express');
const categoryService = require('../services/categoryService');

const createCategory = async (req, res) =>{
    try {
        const category = await categoryService.createCategory(req.body.name);
        res.status(201).json(category);
    } catch (error) {
        console.error('Error creating category', error);
        res.status(500).json({message:'Failed to create category', error:error.message});
    }
};

const assignCategory = async (req, res) =>{
    try {
        const noteId = parseInt(req.params.noteId, 10);
        const categoryId = parseInt(req.params.categoryId, 10);
        const result = await categoryService.assignCategory(noteId, categoryId);
        if(!result){
            return res.status(404).json({error: 'Note or category not found'});
        }
        res.json({ message: 'Category added to note', category: result });
    } catch (error) {
        console.error('Error assigning category:', error);
        res.status(500).json({message: 'Failed to assign category', error:error.message});   
    }
};

const removeCategory = async (req, res) =>{
    try {
        const noteId = parseInt(req.params.noteId, 10);
        const categoryId = parseInt(req.params.categoryId, 10);

        const result = await categoryService.unassignCategory(noteId, categoryId);
        if(!result){
            res.status(404).json({ error : 'Note not foud or category already assigned'});
        }
        res.json({ message: 'Category removed from note'});
    } catch (error) {
        res.status(500).json({ message:'Failed to remove category', error: error.message});
    }
};

const getNotesByCategory = async(req, res) =>{
    try {
        const notes = await categoryService.getNotesByCategory(req.params.categoryName);
        res.json(notes);
    } catch (error) {
        res.status(500).json({message: 'Failed to retrieve notes with this category', error: error.message});
    }
};

module.exports = {
    createCategory,
    assignCategory,
    removeCategory,
    getNotesByCategory
};
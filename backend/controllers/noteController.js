const noteService = require('../services/noteService');

const create = async(req, res) => {
   try {
        const note = await noteService.createNote(req.body)
        res.status(201).json(note);
   } catch (error) {
        console.error("Error creating note:", error);
        res.status(500).json({ message: "Could not create note", details: error.message });
   }
};

const listNotes = async (req, res) => {
    try {
        const { archived, categoryId } = req.query; 

        let filterArchived = null;
        if (archived === 'true') {
            filterArchived = true;  
        } else if (archived === 'false') {
            filterArchived = false; 
        } 
        const notes = await noteService.getAllNotes({ 
            filterArchived,
            categoryId: categoryId ? parseInt(categoryId, 10): null
        }); 
        res.status(200).json(notes);
    } catch (error) {
        console.error("Error listing notes:", error);
        res.status(500).json({ message: "Failed to retrieve notes.", error: error.message });
    }
};

const getNote = async(req, res)=>{
    try {
        const { id } = req.params;
        const note = await noteService.getNoteById(id);
        if (!note) {
            return res.status(404).json({ message: "Note not found." });
        }
        res.status(200).json(note);
    } catch (error) {
        console.error("Error obtaining note:", error);
        res.status(500).json({message: "Could not retrieve note", details: error.message });
    }
};

const updateNote = async(req, res) =>{
    try {
        const { id } = req.params; 
        const updateData = req.body; 
        const updatedNote = await noteService.updateNote(id, req.body);
        if(!updatedNote){
            return res.status(404).json({message: "Not was not found"});
        }
        res.status(200).json(updatedNote);  
    } catch (error) {
        console.error("Error updating note:", error);
        res.status(500).json({message: "Could not update the note", details:error.message });
    }
};

const deleteNote = async(req, res) =>{
    try {
        const { id } = req.params;
        const deleted = await noteService.deleteNote(id);
        if(deleted === null){
            return res.status(404).json({message:"Note not found"});
        }
        res.status(204).json({ message: "Note deleted successfully." });
    } catch (error) {
        console.error("Error deleting note:", error);
        res.status(500).json({message:"Error while attemting to delete", details: error.message});
    }
};

const toggleNote = async(req, res) =>{
    try {
        const { id } = req.params;
        const toggledNote = await noteService.archivedNote(id);
        if(toggledNote === null){
            return res.status(404).json({message:"Note not found"});
        }
        res.status(200).json({message: "Note toggled succesfully"});
    } catch (error) {
        console.error("Error toggling note status", error);
        res.status(500).json({message: "Failed to toggle note status", details: error.message});
    }
};


module.exports = {
    create,
    listNotes,
    getNote,
    updateNote,
    deleteNote,
    toggleNote
};
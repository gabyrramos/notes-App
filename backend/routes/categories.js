const express = require('express');
const router = express.Router();
const categoryController = require('../controllers/categoryController');

router.post('/', categoryController.createCategory);
router.post('/notes/:noteId/categories/:categoryId', categoryController.assignCategory);
router.delete('/notes/:noteId/categories/:categoryId', categoryController.removeCategory);
router.get('/notes/by-category/:categoryName', categoryController.getNotesByCategory);

module.exports = router;
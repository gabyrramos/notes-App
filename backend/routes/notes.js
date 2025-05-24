const express = require('express');
const router = express.Router();
const noteController = require('../controllers/noteController');

router.post('/', noteController.create);
router.get('/', noteController.listNotes);
router.get('/:id', noteController.getNote);
router.put('/:id', noteController.updateNote);
router.delete('/:id', noteController.deleteNote);
router.patch('/:id/archive', noteController.toggleNote);

module.exports = router;
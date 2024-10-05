// routes/noteRoutes.js

const express = require('express');
const router = express.Router();
const noteController = require('../controllers/noteController');
const authenticateToken = require('../middleware/auth');

router.get('/', authenticateToken, noteController.getNotes);
router.post('/', authenticateToken, noteController.addNote);

module.exports = router;

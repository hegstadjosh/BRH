// controllers/noteController.js

const Note = require('../models/Note');

exports.getNotes = async (req, res) => {
  try {
    const userId = req.user.id;
    const notes = await Note.find({ userId }).sort({ category: 1, date: -1 });
    res.json(notes);
  } catch (err) {
    console.error('Error fetching notes:', err);
    res.status(500).json({ message: 'Server error' });
  }
};

exports.addNote = async (req, res) => {
  try {
    const userId = req.user.id;
    const { title, content, category } = req.body;

    const newNote = new Note({
      userId,
      title,
      content,
      category,
    });

    const savedNote = await newNote.save();
    res.status(201).json(savedNote);
  } catch (err) {
    console.error('Error adding note:', err);
    res.status(500).json({ message: 'Server error' });
  }
};

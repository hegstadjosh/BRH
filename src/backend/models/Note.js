// models/Note.js

const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const NoteSchema = new Schema({
  userId:    { type: Schema.Types.ObjectId, ref: 'User', required: true },
  title:     { type: String, required: true },
  content:   { type: String, required: true },
  category:  { type: String, required: true },
  date:      { type: Date, default: Date.now },
});

module.exports = mongoose.model('Note', NoteSchema);

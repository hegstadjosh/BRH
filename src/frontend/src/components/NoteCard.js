// src/components/NoteCard.js

import React from 'react';

function NoteCard({ note }) {
  return (
    <div className="note-card">
      <h3>{note.title}</h3>
      <p>{note.content.substring(0, 100)}...</p>
      <p className="date">{new Date(note.date).toLocaleDateString()}</p>
    </div>
  );
}

export default NoteCard;

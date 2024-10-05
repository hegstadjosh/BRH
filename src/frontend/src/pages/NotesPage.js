// src/pages/NotesPage.js

import React, { useState, useEffect } from 'react';
import axios from 'axios';
import NoteCard from '../components/NoteCard';
import AddNoteForm from '../components/AddNoteForm';

function NotesPage() {
  const [notes, setNotes] = useState([]);

  useEffect(() => {
    fetchNotes();
  }, []);

  const fetchNotes = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get('http://localhost:5000/api/notes', {
        headers: { Authorization: token },
      });
      setNotes(response.data);
    } catch (error) {
      console.error('Error fetching notes:', error);
    }
  };

  return (
    <div className="container">
      <h1>Your Notes</h1>
      <AddNoteForm fetchNotes={fetchNotes} />
      <div className="notes-grid">
        {notes.map((note) => (
          <NoteCard key={note._id} note={note} />
        ))}
      </div>
    </div>
  );
}

export default NotesPage;

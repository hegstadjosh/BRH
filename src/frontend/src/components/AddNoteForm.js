// src/components/AddNoteForm.js

import React, { useState } from 'react';
import axios from 'axios';

function AddNoteForm({ fetchNotes }) {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [category, setCategory] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('token');
      await axios.post(
        'http://localhost:5000/api/notes',
        { title, content, category },
        { headers: { Authorization: token } }
      );
      setTitle('');
      setContent('');
      setCategory('');
      fetchNotes(); // Refresh notes
    } catch (error) {
      console.error('Error adding note:', error);
      alert('Error adding note');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="form">
      <input type="text" placeholder="Title" value={title}
        onChange={(e) => setTitle(e.target.value)} required />
      <textarea placeholder="Content" value={content}
        onChange={(e) => setContent(e.target.value)} required></textarea>
      <input type="text" placeholder="Category" value={category}
        onChange={(e) => setCategory(e.target.value)} required />
      <button type="submit">Add Note</button>
    </form>
  );
}

export default AddNoteForm;

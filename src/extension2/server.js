const express = require('express');
const cors = require('cors');
const sqlite3 = require('sqlite3').verbose();
const bodyParser = require('body-parser');

const app = express();
app.use(cors());
app.use(bodyParser.json());

// Connect to SQLite database
const db = new sqlite3.Database('./notes.db', (err) => {
  if (err) {
    console.error(err.message);
  }
  console.log('Connected to the notes database.');
});

// Create notes table if not exists
db.run(`CREATE TABLE IF NOT EXISTS notes (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  title TEXT,
  content TEXT,
  category TEXT,
  date TEXT
)`);

// Save a new note
app.post('/save-note', (req, res) => {
  const { title, content, category } = req.body;
  const date = new Date().toISOString();
  
  db.run(`INSERT INTO notes (title, content, category, date) VALUES (?, ?, ?, ?)`,
    [title, content, category, date],
    function(err) {
      if (err) {
        res.status(500).json({ error: err.message });
        return;
      }
      res.json({ id: this.lastID });
    }
  );
});

// Get all notes
app.get('/get-notes', (req, res) => {
  db.all(`SELECT * FROM notes ORDER BY date DESC`, [], (err, rows) => {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }
    res.json(rows);
  });
});

// Delete a note
app.delete('/delete-note/:id', (req, res) => {
  db.run(`DELETE FROM notes WHERE id = ?`, req.params.id, function(err) {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }
    res.json({ message: "deleted", changes: this.changes });
  });
});

// Start server
const PORT = 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

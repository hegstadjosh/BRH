from flask import Flask, render_template, request, redirect, url_for, jsonify
from flask_cors import CORS
import sqlite3
from datetime import datetime

app = Flask(__name__)
CORS(app)

def get_db_connection():
    conn = sqlite3.connect('notes.db')
    conn.row_factory = sqlite3.Row
    return conn

@app.route('/')
def index():
    conn = get_db_connection()
    notes = conn.execute('SELECT * FROM notes ORDER BY date DESC').fetchall()
    conn.close()
    return render_template('index.html', notes=notes)

@app.route('/add_note', methods=['POST'])
def add_note():
    title = request.form['title']
    content = request.form['content']
    category = request.form['category']
    date = datetime.now().isoformat()
    
    conn = get_db_connection()
    conn.execute('INSERT INTO notes (title, content, category, date) VALUES (?, ?, ?, ?)',
                 (title, content, category, date))
    conn.commit()
    conn.close()
    return redirect(url_for('index'))

@app.route('/delete_note/<int:id>', methods=['POST'])
def delete_note(id):
    conn = get_db_connection()
    conn.execute('DELETE FROM notes WHERE id = ?', (id,))
    conn.commit()
    conn.close()
    return redirect(url_for('index'))

@app.route('/get_note/<int:id>')
def get_note(id):
    conn = get_db_connection()
    note = conn.execute('SELECT * FROM notes WHERE id = ?', (id,)).fetchone()
    conn.close()
    return jsonify(dict(note))

if __name__ == '__main__':
    app.run(debug=True, port=5001)

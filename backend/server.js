const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const sqlite3 = require('sqlite3').verbose();
const { v4: uuidv4 } = require('uuid');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Database setup
const dbPath = path.join(__dirname, 'database.sqlite');
const db = new sqlite3.Database(dbPath);

// Initialize database tables
db.serialize(() => {
  db.run(`CREATE TABLE IF NOT EXISTS events (
    id TEXT PRIMARY KEY,
    title TEXT NOT NULL,
    description TEXT,
    start_date TEXT NOT NULL,
    end_date TEXT NOT NULL,
    start_time TEXT NOT NULL,
    end_time TEXT NOT NULL,
    creator_name TEXT NOT NULL,
    creator_email TEXT NOT NULL,
    location TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
  )`);
});

// Routes

// Get all events
app.get('/api/events', (req, res) => {
  db.all('SELECT * FROM events ORDER BY start_date ASC, start_time ASC', (err, rows) => {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }
    res.json({ events: rows });
  });
});

// Get a specific event
app.get('/api/events/:id', (req, res) => {
  const { id } = req.params;
  db.get('SELECT * FROM events WHERE id = ?', [id], (err, row) => {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }
    if (!row) {
      res.status(404).json({ error: 'Event not found' });
      return;
    }
    res.json({ event: row });
  });
});

// Create a new event
app.post('/api/events', (req, res) => {
  const {
    title,
    description,
    start_date,
    end_date,
    start_time,
    end_time,
    creator_name,
    creator_email,
    location
  } = req.body;

  // Validation
  if (!title || !start_date || !end_date || !start_time || !end_time || !creator_name || !creator_email) {
    res.status(400).json({ error: 'Missing required fields' });
    return;
  }

  const id = uuidv4();
  const created_at = new Date().toISOString();

  db.run(
    `INSERT INTO events (id, title, description, start_date, end_date, start_time, end_time, creator_name, creator_email, location, created_at, updated_at)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
    [id, title, description, start_date, end_date, start_time, end_time, creator_name, creator_email, location, created_at, created_at],
    function(err) {
      if (err) {
        res.status(500).json({ error: err.message });
        return;
      }
      res.status(201).json({
        message: 'Event created successfully',
        event: {
          id,
          title,
          description,
          start_date,
          end_date,
          start_time,
          end_time,
          creator_name,
          creator_email,
          location,
          created_at
        }
      });
    }
  );
});

// Update an event
app.put('/api/events/:id', (req, res) => {
  const { id } = req.params;
  const {
    title,
    description,
    start_date,
    end_date,
    start_time,
    end_time,
    creator_name,
    creator_email,
    location
  } = req.body;

  const updated_at = new Date().toISOString();

  db.run(
    `UPDATE events SET title = ?, description = ?, start_date = ?, end_date = ?, start_time = ?, end_time = ?, creator_name = ?, creator_email = ?, location = ?, updated_at = ?
     WHERE id = ?`,
    [title, description, start_date, end_date, start_time, end_time, creator_name, creator_email, location, updated_at, id],
    function(err) {
      if (err) {
        res.status(500).json({ error: err.message });
        return;
      }
      if (this.changes === 0) {
        res.status(404).json({ error: 'Event not found' });
        return;
      }
      res.json({ message: 'Event updated successfully' });
    }
  );
});

// Delete an event
app.delete('/api/events/:id', (req, res) => {
  const { id } = req.params;
  
  db.run('DELETE FROM events WHERE id = ?', [id], function(err) {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }
    if (this.changes === 0) {
      res.status(404).json({ error: 'Event not found' });
      return;
    }
    res.json({ message: 'Event deleted successfully' });
  });
});

// Get events for a specific date range
app.get('/api/events/range/:startDate/:endDate', (req, res) => {
  const { startDate, endDate } = req.params;
  
  db.all(
    'SELECT * FROM events WHERE start_date >= ? AND start_date <= ? ORDER BY start_date ASC, start_time ASC',
    [startDate, endDate],
    (err, rows) => {
      if (err) {
        res.status(500).json({ error: err.message });
        return;
      }
      res.json({ events: rows });
    }
  );
});

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', timestamp: new Date().toISOString() });
});

// Start server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
  console.log(`Database path: ${dbPath}`);
});

// Graceful shutdown
process.on('SIGINT', () => {
  console.log('\nShutting down gracefully...');
  db.close((err) => {
    if (err) {
      console.error(err.message);
    }
    console.log('Database connection closed.');
    process.exit(0);
  });
});
const sqlite3 = require('sqlite3').verbose();
const path = require('path');
const { v4: uuidv4 } = require('uuid');

const dbPath = path.join(__dirname, '../database.sqlite');
const db = new sqlite3.Database(dbPath);

console.log('Initializing database...');

db.serialize(() => {
  // Create events table
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

  // Insert sample data
  const sampleEvents = [
    {
      id: uuidv4(),
      title: 'Team Meeting',
      description: 'Weekly team sync-up meeting',
      start_date: '2025-09-20',
      end_date: '2025-09-20',
      start_time: '10:00',
      end_time: '11:00',
      creator_name: 'John Doe',
      creator_email: 'john.doe@example.com',
      location: 'Conference Room A'
    },
    {
      id: uuidv4(),
      title: 'Client Presentation',
      description: 'Quarterly business review with ABC Corp',
      start_date: '2025-09-22',
      end_date: '2025-09-22',
      start_time: '14:00',
      end_time: '15:30',
      creator_name: 'Jane Smith',
      creator_email: 'jane.smith@example.com',
      location: 'Virtual Meeting'
    },
    {
      id: uuidv4(),
      title: 'Project Planning',
      description: 'Q4 project planning session',
      start_date: '2025-09-25',
      end_date: '2025-09-25',
      start_time: '09:00',
      end_time: '12:00',
      creator_name: 'Mike Johnson',
      creator_email: 'mike.johnson@example.com',
      location: 'Main Office'
    }
  ];

  const stmt = db.prepare(`INSERT INTO events (id, title, description, start_date, end_date, start_time, end_time, creator_name, creator_email, location) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`);
  
  sampleEvents.forEach(event => {
    stmt.run(
      event.id,
      event.title,
      event.description,
      event.start_date,
      event.end_date,
      event.start_time,
      event.end_time,
      event.creator_name,
      event.creator_email,
      event.location
    );
  });
  
  stmt.finalize();

  console.log('Database initialized successfully!');
  console.log(`Sample events added: ${sampleEvents.length}`);
});

db.close((err) => {
  if (err) {
    console.error('Error closing database:', err.message);
  } else {
    console.log('Database connection closed.');
  }
});
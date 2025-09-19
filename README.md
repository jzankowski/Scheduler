# Calendar Scheduler

A full-stack web application for calendar scheduling with two distinct user experiences:
1. **Event Creator Experience** - Interface for adding new events to the calendar
2. **Calendar Viewer Experience** - Interface for viewing scheduled events

## Features

### Event Creator Experience
- ✅ Create new calendar events
- ✅ Set event details (title, description, date, time, location)
- ✅ Add creator contact information
- ✅ Form validation and error handling
- ✅ Success confirmation

### Calendar Viewer Experience
- ✅ View all scheduled events
- ✅ Events grouped by date and sorted chronologically
- ✅ Filter events by specific date
- ✅ Expandable event details
- ✅ Event status indicators (today, upcoming, past)
- ✅ Responsive design

### Backend API
- ✅ RESTful API for event management
- ✅ SQLite database for data persistence
- ✅ CRUD operations for events
- ✅ Date range queries
- ✅ Input validation and error handling

## Tech Stack

### Frontend
- **React 18** - UI framework
- **Axios** - HTTP client
- **date-fns** - Date manipulation
- **CSS3** - Styling with responsive design

### Backend
- **Node.js** - Runtime environment
- **Express.js** - Web framework
- **SQLite3** - Database
- **CORS** - Cross-origin resource sharing
- **UUID** - Unique identifiers

## Project Structure

```
Scheduler/
├── backend/                 # Node.js/Express API server
│   ├── scripts/            # Database initialization scripts
│   ├── server.js           # Main server file
│   ├── package.json        # Backend dependencies
│   └── .env.example        # Environment variables template
├── frontend/               # React application
│   ├── public/             # Static files
│   ├── src/
│   │   ├── components/     # React components
│   │   ├── App.js          # Main app component
│   │   ├── index.js        # Entry point
│   │   └── index.css       # Global styles
│   └── package.json        # Frontend dependencies
└── README.md              # This file
```

## Getting Started

### Prerequisites
- Node.js (v14 or higher)
- npm or yarn

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd Scheduler
   ```

2. **Set up the backend**
   ```bash
   cd backend
   npm install
   
   # Copy environment variables (optional)
   cp .env.example .env
   
   # Initialize database with sample data
   npm run init-db
   ```

3. **Set up the frontend**
   ```bash
   cd ../frontend
   npm install
   ```

### Running the Application

1. **Start the backend server** (in `backend/` directory)
   ```bash
   npm run dev
   # Server will run on http://localhost:3001
   ```

2. **Start the frontend** (in `frontend/` directory)
   ```bash
   npm start
   # Application will open on http://localhost:3000
   ```

The frontend is configured to proxy API requests to the backend server.

## API Endpoints

### Events
- `GET /api/events` - Get all events
- `GET /api/events/:id` - Get specific event
- `POST /api/events` - Create new event
- `PUT /api/events/:id` - Update event
- `DELETE /api/events/:id` - Delete event
- `GET /api/events/range/:startDate/:endDate` - Get events in date range

### Health Check
- `GET /api/health` - Server health status

## Database Schema

### Events Table
```sql
CREATE TABLE events (
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
);
```

## Usage Examples

### Creating an Event
1. Navigate to the application
2. Click "Create Event" button
3. Fill out the event form with required information
4. Submit to add the event to the calendar

### Viewing Events
1. Click "View Calendar" button (default view)
2. Browse events organized by date
3. Click on any event to see detailed information
4. Use date filter to view events for specific dates

## Development

### Backend Development
```bash
cd backend
npm run dev  # Starts server with nodemon for auto-restart
```

### Frontend Development
```bash
cd frontend
npm start    # Starts development server with hot reload
```

### Database Management
```bash
cd backend
npm run init-db  # Initialize/reset database with sample data
```

## Future Enhancements

- 🔄 Edit/Delete event functionality
- 👥 User authentication and authorization  
- 📧 Email notifications for events
- 🔄 Event recurrence (daily, weekly, monthly)
- 📱 Mobile app version
- 🌐 Calendar integrations (Google Calendar, Outlook)
- 🎨 Theming and customization options
- 📊 Analytics and reporting
- 🔍 Advanced search and filtering
- 💾 Export calendar data

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.

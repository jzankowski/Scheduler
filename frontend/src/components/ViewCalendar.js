import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { format, parseISO, isToday, isFuture, isPast } from 'date-fns';

const ViewCalendar = () => {
  const [events, setEvents] = useState([]);
  const [filteredEvents, setFilteredEvents] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [filterDate, setFilterDate] = useState('');
  const [selectedEventId, setSelectedEventId] = useState(null);

  useEffect(() => {
    fetchEvents();
  }, []);

  useEffect(() => {
    filterEventsByDate();
  }, [events, filterDate]);

  const fetchEvents = async () => {
    try {
      setIsLoading(true);
      const response = await axios.get('/api/events');
      setEvents(response.data.events);
      setError('');
    } catch (err) {
      setError('Failed to load events. Please try again.');
      console.error('Error fetching events:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const filterEventsByDate = () => {
    if (!filterDate) {
      setFilteredEvents(events);
      return;
    }

    const filtered = events.filter(event => {
      return event.start_date === filterDate || event.end_date === filterDate;
    });
    setFilteredEvents(filtered);
  };

  const formatEventTime = (startTime, endTime) => {
    try {
      const start = format(parseISO(`2000-01-01T${startTime}`), 'h:mm a');
      const end = format(parseISO(`2000-01-01T${endTime}`), 'h:mm a');
      return `${start} - ${end}`;
    } catch {
      return `${startTime} - ${endTime}`;
    }
  };

  const formatEventDate = (startDate, endDate) => {
    try {
      const start = format(parseISO(startDate), 'MMM d, yyyy');
      if (startDate === endDate) {
        return start;
      }
      const end = format(parseISO(endDate), 'MMM d, yyyy');
      return `${start} - ${end}`;
    } catch {
      return `${startDate} - ${endDate}`;
    }
  };

  const getEventStatus = (startDate) => {
    try {
      const eventDate = parseISO(startDate);
      if (isToday(eventDate)) return 'today';
      if (isFuture(eventDate)) return 'upcoming';
      if (isPast(eventDate)) return 'past';
    } catch {
      return 'unknown';
    }
  };

  const groupEventsByDate = (events) => {
    const grouped = {};
    events.forEach(event => {
      const date = event.start_date;
      if (!grouped[date]) {
        grouped[date] = [];
      }
      grouped[date].push(event);
    });
    
    // Sort dates
    const sortedDates = Object.keys(grouped).sort();
    const result = {};
    sortedDates.forEach(date => {
      // Sort events by start time within each date
      result[date] = grouped[date].sort((a, b) => a.start_time.localeCompare(b.start_time));
    });
    
    return result;
  };

  const handleEventClick = (eventId) => {
    setSelectedEventId(selectedEventId === eventId ? null : eventId);
  };

  const clearDateFilter = () => {
    setFilterDate('');
  };

  if (isLoading) {
    return (
      <div className="calendar-container">
        <div className="loading">Loading events...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="calendar-container">
        <div className="error">{error}</div>
        <button className="submit-button" onClick={fetchEvents}>
          Try Again
        </button>
      </div>
    );
  }

  const groupedEvents = groupEventsByDate(filteredEvents);

  return (
    <div className="calendar-container">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
        <h2>Calendar Events</h2>
        <button className="nav-button" onClick={fetchEvents}>
          🔄 Refresh
        </button>
      </div>

      <div className="date-filter">
        <label>Filter by date: </label>
        <input
          type="date"
          value={filterDate}
          onChange={(e) => setFilterDate(e.target.value)}
        />
        {filterDate && (
          <button
            className="nav-button"
            onClick={clearDateFilter}
            style={{ marginLeft: '10px' }}
          >
            Clear Filter
          </button>
        )}
      </div>

      {filteredEvents.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '2rem', color: '#7f8c8d' }}>
          {filterDate ? 'No events found for the selected date.' : 'No events scheduled yet.'}
        </div>
      ) : (
        <div className="events-list">
          {Object.entries(groupedEvents).map(([date, dayEvents]) => (
            <div key={date} style={{ marginBottom: '2rem' }}>
              <h3 style={{ 
                color: '#2c3e50', 
                borderBottom: '2px solid #3498db', 
                paddingBottom: '0.5rem',
                marginBottom: '1rem'
              }}>
                {formatEventDate(date, date)}
                {getEventStatus(date) === 'today' && (
                  <span style={{ 
                    background: '#e74c3c', 
                    color: 'white', 
                    padding: '2px 8px', 
                    borderRadius: '12px', 
                    fontSize: '0.8rem',
                    marginLeft: '10px'
                  }}>
                    Today
                  </span>
                )}
              </h3>
              
              {dayEvents.map((event) => (
                <div
                  key={event.id}
                  className="event-card"
                  onClick={() => handleEventClick(event.id)}
                  style={{ 
                    cursor: 'pointer',
                    border: selectedEventId === event.id ? '2px solid #3498db' : '1px solid #bdc3c7'
                  }}
                >
                  <div className="event-title">{event.title}</div>
                  <div className="event-time">
                    🕐 {formatEventTime(event.start_time, event.end_time)}
                  </div>
                  <div className="event-creator">
                    👤 {event.creator_name} ({event.creator_email})
                  </div>
                  
                  {selectedEventId === event.id && (
                    <div style={{ marginTop: '1rem', padding: '1rem', background: '#f8f9fa', borderRadius: '4px' }}>
                      {event.description && (
                        <div className="event-description">
                          <strong>Description:</strong><br />
                          {event.description}
                        </div>
                      )}
                      {event.location && (
                        <div className="event-location">
                          📍 <strong>Location:</strong> {event.location}
                        </div>
                      )}
                      <div style={{ marginTop: '0.5rem', fontSize: '0.8rem', color: '#7f8c8d' }}>
                        <strong>Created:</strong> {new Date(event.created_at).toLocaleString()}
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          ))}
        </div>
      )}

      {!filterDate && (
        <div style={{ marginTop: '2rem', textAlign: 'center', color: '#7f8c8d' }}>
          <p>Total events: {events.length}</p>
          <p>Click on any event to see more details</p>
        </div>
      )}
    </div>
  );
};

export default ViewCalendar;
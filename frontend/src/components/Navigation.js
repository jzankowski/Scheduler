import React from 'react';

const Navigation = ({ currentView, setCurrentView }) => {
  return (
    <div className="tab-navigation" role="tablist" aria-label="Calendar Scheduler Views">
      <button
        className={`tab ${currentView === 'view' ? 'active' : ''}`}
        onClick={() => setCurrentView('view')}
        role="tab"
        aria-selected={currentView === 'view'}
        aria-controls="calendar-viewer-panel"
        id="calendar-viewer-tab"
      >
        <div className="tab-icon">📅</div>
        <div className="tab-content">
          <div className="tab-title">Calendar Viewer</div>
          <div className="tab-description">Browse and view scheduled events</div>
        </div>
      </button>
      <button
        className={`tab ${currentView === 'create' ? 'active' : ''}`}
        onClick={() => setCurrentView('create')}
        role="tab"
        aria-selected={currentView === 'create'}
        aria-controls="event-creator-panel"
        id="event-creator-tab"
      >
        <div className="tab-icon">➕</div>
        <div className="tab-content">
          <div className="tab-title">Event Creator</div>
          <div className="tab-description">Add new events to the calendar</div>
        </div>
      </button>
    </div>
  );
};

export default Navigation;
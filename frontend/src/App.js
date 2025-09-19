import React, { useState } from 'react';
import Navigation from './components/Navigation';
import CreateEvent from './components/CreateEvent';
import ViewCalendar from './components/ViewCalendar';

function App() {
  const [currentView, setCurrentView] = useState('view');

  return (
    <div className="App">
      <header className="header">
        <div className="container">
          <h1>Calendar Scheduler</h1>
        </div>
      </header>
      
      <div className="container">
        <Navigation currentView={currentView} setCurrentView={setCurrentView} />
        
        {/* Tab Panels */}
        <div className="tab-panels">
          {currentView === 'view' && (
            <div 
              role="tabpanel" 
              id="calendar-viewer-panel" 
              aria-labelledby="calendar-viewer-tab"
              className="tab-panel active"
            >
              <ViewCalendar />
            </div>
          )}
          {currentView === 'create' && (
            <div 
              role="tabpanel" 
              id="event-creator-panel" 
              aria-labelledby="event-creator-tab"
              className="tab-panel active"
            >
              <CreateEvent />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default App;
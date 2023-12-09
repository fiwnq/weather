/*import React, { useState, useEffect } from 'react';
import './App.css';
import Weather from './weather.js'; 

function App() {
  const [location, setLocation] = useState('Nashville US'); // made nashville default
  const [users, setUsers] = useState([]);

  useEffect(() => {
    fetch(`/api/users`)
      .then(res => res.json())
      .then(data => setUsers(data));
  }, []);

  const handleSearch = (event) => {
    event.preventDefault();
    const newLocation = event.target.elements.inputLocation.value.trim();
    setLocation(newLocation); 
  };

  return (
    <div className="App">
      <h1>Lipscomb Weather App</h1>
      
      <div className="row-1">
        <form id="query-weather" onSubmit={handleSearch}>
          <input type="text" className="input-left" id="input-location" name="inputLocation" placeholder="Enter Location" />
          <button className="button-right" type="submit"><i className="fa fa-search"></i></button>
        </form>
      </div>

      <Weather location={location} /> {}

      
      
    </div>
  );
}

export default App;
old */

import React, { useState, useEffect } from 'react';
import './App.css';
import Weather from './weather.js';

function App() {
    const [location, setLocation] = useState('Nashville US');

    const handleSearch = (event) => {
        event.preventDefault();
        const newLocation = event.target.elements.inputLocation.value.trim();
        setLocation(newLocation); 
    };

    return (
        <div>
            <h1>Lipscomb Weather App</h1>
            <div className="row-1">
                <form id="query-weather" method="POST" onSubmit={handleSearch}>
                    <input type="text" className="input-left" id="input-location" name="inputLocation" placeholder="Enter Location" />
                    <button className="button-right" type="submit"><i className="fa fa-search"></i></button>
                </form>
            </div>
            <Weather location={location} />
        </div>
    );
}

export default App;

import logo from './logo.svg';
import './App.css';
import Weather from './weather';
import { useEffect, useState } from 'react';

function App() {

  const [users, setUsers] = useState([]);
  useEffect(() => {
    fetch(`/api/users`)
    .then ((res) => res.json())
    .then ((data) => setUsers(data));
  }, []);
  return (
    <div className="App">
      <h1>Weather app</h1>
      <Weather /> {/* Render the Weather component */}
      <h2>Users</h2>
      {users.map((user) => (
        <p key={user.id}>{user.name}</p>
      ))}
    </div>
  );
}

export default App;

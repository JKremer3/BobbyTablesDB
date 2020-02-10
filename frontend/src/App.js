import React from 'react';
import logo from './logo.svg';
import './App.css';

function App() {
  return (
      <div className="App">
          <select id="State">
              <option value="WA">WA</option>
              <option value="ID">ID</option>
              <option value="FL">FL</option>
              <option value="CA">CA</option>
          </select>
          <select id="City">
              <option value="WA">Pullman</option>
              <option value="ID">Vancouver</option>
              <option value="FL">Seattle</option>
              <option value="CA">Spokane</option>
          </select>
      <div></div>
      <div></div>
  </div>
  );
}

export default App;

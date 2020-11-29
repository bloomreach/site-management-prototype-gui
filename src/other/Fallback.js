import React from 'react';
import './Fallback.css';
import logo from './logo.svg';

function Fallback () {
  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo"/>
        <p>
          This is a test frontend project for the Site Dev API
        </p>
      </header>
    </div>
  );
}

export default Fallback;

import React from 'react';
import logo from './logo.svg';
import './App.css';
import Chessboard from './components/Chessboard/Chessboard';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChess } from '@fortawesome/free-solid-svg-icons';

function App() {


  return (
    <div>
      <div className="container">
      <nav className="sidebar">
        <div className="logo">
          <FontAwesomeIcon icon={faChess} className="icon-big" />
          <a href="#">Chess</a>
        </div>
        <ul className="nav-links">
          <li><a href="#">Help</a></li>
          {/* Add more navigation links as needed */}
        </ul>
      </nav>
      <div id="app">
        
        <Chessboard></Chessboard>
      </div>
      </div>
      
    </div>
  );
}

export default App;

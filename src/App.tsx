import React from 'react';
import Navbar from './components/Navbar';
import 'bootstrap'
import './styles/App.scss';

function App() {
  return (
    <div className="App">
      <header className="App-header">
        <Navbar />
      </header>
      <div>Hi</div>
    </div>
  );
}

export default App;

import React from 'react';
import { BrowserRouter as Router, Route } from 'react-router-dom'
import Navbar from './components/Navbar';
import About from './components/pages/About';
import './styles/App.scss';
import PTList from './components/pages/PTList';
import GeneralInfo from './components/pages/GeneralInfo';

function App() {
  return (
    <Router>
      <div className="App">
        <header className="App-header">
          <Navbar />
        </header>
        <Route exact path="/" render={props => (
          <>
            <GeneralInfo />
            <PTList />
          </>
        )} />
        <Route path="/about" component={About} />
      </div>
    </Router>
  );
}

export default App;

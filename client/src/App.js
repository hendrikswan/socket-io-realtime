import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';
import { subscribeToTimer } from './api';


class App extends Component {
  constructor(props) {
    super(props);

    subscribeToTimer((err, timestamp) => {
      this.setState({
        timestamp
      });
    });
  }

  state = {
    timestamp: 'no timestamp yet'
  };

  render() {
    return (
      <div className="App">
        <div className="App-header">
          <img src={logo} className="App-logo" alt="logo" />
          <h2>Welcome to React</h2>
        </div>
        <p className="App-intro">
          This is the value of the timer timestamp: {this.state.timestamp}
        </p>
      </div>
    );
  }
}

export default App;

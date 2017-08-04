import React, { Component } from 'react';
import { subscribeToConnectionEvent } from './api';

class Connection extends Component {
  state = {
    connectionState: 'connecting',
  };

  constructor(props) {
    super(props);
    subscribeToConnectionEvent((connectionState) => {
      this.setState({
        connectionState,
      });
    });
  }


  render() {
    let content = null;

    if (this.state.connectionState === 'disconnected') {
      content = (
        <div className="Connection-error">We've lost connection to the server...</div>
      );
    }

    if (this.state.connectionState === 'connecting') {
      content = (
        <div>Connecting...</div>
      );
    }

    return (
      <div className="Connection">{content}</div>
    );
  }
}

export default Connection;
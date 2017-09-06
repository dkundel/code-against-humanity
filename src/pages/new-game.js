import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import styled from 'styled-components';

import Paper from 'material-ui/Paper';
import TextField from 'material-ui/TextField';
import FlatButton from 'material-ui/FlatButton';
import RaisedButton from 'material-ui/RaisedButton';
import { red500, grey500, grey800, white } from 'material-ui/styles/colors';

import { H3, MutedText } from '../components/common';

class NewGame extends Component {
  constructor(...args) {
    super(...args);
    this.state = {
      roomId: ''
    };

    this.handleInputChange = this.handleInputChange.bind(this);
    this.createGame = this.createGame.bind(this);
  }

  handleInputChange(evt) {
    const name = evt.target.name;
    const value = evt.target.value;
    console.log(name, value);
    this.setState({ [name]: value });
  }

  createGame() {
    const { roomId } = this.state;
    const { history } = this.props;

    console.log('Creating room...');
  }

  render() {
    return (
      <Paper zDepth={1} style={{ padding: 10, marginBottom: 20 }}>
        <H3>Create a Game</H3>
        <TextField
          floatingLabelText="Choose your name:"
          floatingLabelFixed
          fullWidth
          name="roomId"
          onChange={this.handleInputChange}
        />
        <RaisedButton
          primary
          fullWidth
          style={{ marginBottom: 10 }}
          onClick={this.createGame}
        >
          Start
        </RaisedButton>
        <Link to="/">
          <FlatButton fullWidth>Cancel</FlatButton>
        </Link>
      </Paper>
    );
  }
}

export default NewGame;

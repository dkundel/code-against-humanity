import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import styled from 'styled-components';

import Avatar from 'material-ui/Avatar';
import Paper from 'material-ui/Paper';
import TextField from 'material-ui/TextField';
import IconButton from 'material-ui/IconButton';
import FlatButton from 'material-ui/FlatButton';
import RaisedButton from 'material-ui/RaisedButton';
import ChevronLeft from 'material-ui/svg-icons/navigation/chevron-left';
import { red500, grey500, grey800, white } from 'material-ui/styles/colors';

import { H3, MutedText } from '../components/common';

class JoinGame extends Component {
  constructor(...args) {
    super(...args);
    this.state = {
      roomId: '',
      username: ''
    };

    this.handleInputChange = this.handleInputChange.bind(this);
    this.joinGame = this.joinGame.bind(this);
  }

  handleInputChange(evt) {
    const name = evt.target.name;
    const value = evt.target.value;
    console.log(name, value);
    this.setState({ [name]: value });
  }

  joinGame() {
    const { username, roomId } = this.state;
    const { history } = this.props;

    console.log(username, roomId);

    if (
      typeof roomId !== 'string' ||
      roomId.length === 0 ||
      typeof username !== 'string' ||
      username.length === 0
    ) {
      return;
    }

    if (history) {
      history.push(`/game/${roomId}`);
    }
  }

  render() {
    return (
      <Paper zDepth={1} style={{ padding: 10, marginBottom: 20 }}>
        <H3>Join a Game</H3>
        <TextField
          floatingLabelText="Room ID:"
          floatingLabelFixed
          fullWidth
          name="roomId"
          onChange={this.handleInputChange}
        />
        <TextField
          floatingLabelText="Choose your name:"
          floatingLabelFixed
          fullWidth
          name="username"
          onChange={this.handleInputChange}
        />
        <RaisedButton
          primary
          fullWidth
          style={{ marginBottom: 10 }}
          onClick={this.joinGame}
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

export default JoinGame;

import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import styled from 'styled-components';

import Avatar from 'material-ui/Avatar';
import Paper from 'material-ui/Paper';
import TextField from 'material-ui/TextField';
import IconButton from 'material-ui/IconButton';
import FlatButton from 'material-ui/FlatButton';
import RaisedButton from 'material-ui/RaisedButton';
import Snackbar from 'material-ui/Snackbar';
import ChevronLeft from 'material-ui/svg-icons/navigation/chevron-left';
import { red500, grey500, grey800, white } from 'material-ui/styles/colors';

import { H3, MutedText } from '../components/common';
import { post } from '../lib/utils';

class JoinGame extends Component {
  constructor(...args) {
    super(...args);
    this.state = {
      roomId: '',
      username: '',
      showAlert: false,
      errorMessage: undefined
    };

    this.handleInputChange = this.handleInputChange.bind(this);
    this.joinGame = this.joinGame.bind(this);
    this.handleErrorMessageClose = this.handleErrorMessageClose.bind(this);
  }

  handleInputChange(evt) {
    const name = evt.target.name;
    const value = evt.target.value;
    console.log(name, value);
    this.setState({ [name]: value });
  }

  async joinGame() {
    const { username, roomId } = this.state;
    const { history } = this.props;

    if (
      typeof roomId !== 'string' ||
      roomId.length === 0 ||
      typeof username !== 'string' ||
      username.length === 0
    ) {
      return;
    }

    if (history === undefined) {
      console.error('Not part of a route component');
      return;
    }

    const resp = await post(`/api/game/join`, { username, roomId });

    if (!resp.ok) {
      const msg = await resp.text();
      this.setState({ showAlert: true, errorMessage: msg });
      return;
    }

    const data = await resp.json();
    localStorage.setItem(`user:${data.roomId}`, data.username);
    history.push(`/game/${data.roomId}`);
  }

  handleErrorMessageClose = () => {
    this.setState({
      showAlert: false,
      errorMessage: undefined
    });
  };

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
          label="Join"
        />
        <Link to="/">
          <FlatButton fullWidth label="Cancel" />
        </Link>
        <Snackbar
          open={this.state.showAlert}
          message={this.state.errorMessage}
          autoHideDuration={4000}
          onRequestClose={this.handleErrorMessageClose}
        />
      </Paper>
    );
  }
}

export default JoinGame;

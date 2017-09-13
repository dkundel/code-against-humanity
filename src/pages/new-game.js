import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import styled from 'styled-components';

import Paper from 'material-ui/Paper';
import TextField from 'material-ui/TextField';
import FlatButton from 'material-ui/FlatButton';
import RaisedButton from 'material-ui/RaisedButton';
import Snackbar from 'material-ui/Snackbar';
import { red500, grey500, grey800, white } from 'material-ui/styles/colors';

import { H3, MutedText } from '../components/common';
import { post } from '../lib/utils';

class NewGame extends Component {
  constructor(...args) {
    super(...args);
    this.state = {
      username: '',
      showAlert: false,
      errorMessage: undefined
    };

    this.handleInputChange = this.handleInputChange.bind(this);
    this.createGame = this.createGame.bind(this);
    this.handleErrorMessageClose = this.handleErrorMessageClose.bind(this);
  }

  handleInputChange(evt) {
    const name = evt.target.name;
    const value = evt.target.value;
    console.log(name, value);
    this.setState({ [name]: value });
  }

  async createGame() {
    const { username } = this.state;
    const { history } = this.props;

    if (history === undefined) {
      console.error('Not part of a route component');
      return;
    }

    const resp = await post(`/api/game/create`, { username });

    if (!resp.ok) {
      const msg = await resp.text();
      this.setState({ showAlert: true, errorMessage: msg });
      return;
    }

    const { roomId } = await resp.json();
    localStorage.setItem(`user:${roomId}`, username);
    history.push(`/game/${roomId}`);
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
        <H3>Create a Game</H3>
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
          onClick={this.createGame}
          label="Start"
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

export default NewGame;

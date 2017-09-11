import React, { Component } from 'react';
import styled from 'styled-components';

import Avatar from 'material-ui/Avatar';
import Divider from 'material-ui/Divider';
import Paper from 'material-ui/Paper';
import FlatButton from 'material-ui/FlatButton';
import { List, ListItem } from 'material-ui/List';
import { red500, grey500, grey800, white } from 'material-ui/styles/colors';

import { H3, MutedText } from '../components/common';

class ScoreScreen extends Component {
  render() {
    const { standings, gameOver, showButton, onClick } = this.props;
    const standingEntries = standings.map((person, idx) => {
      let standing = (
        <Avatar color={red500} backgroundColor={white}>
          {idx + 1}.
        </Avatar>
      );
      let score = (
        <Avatar
          color={grey500}
          backgroundColor={white}
          size={30}
          style={{ marginTop: 5 }}
        >
          {person.score}
        </Avatar>
      );
      return (
        <div>
          <ListItem
            primaryText={person.username}
            leftAvatar={standing}
            rightAvatar={score}
            disabled={true}
          />
          <Divider />
        </div>
      );
    });

    return (
      <Paper zDepth={1} style={{ padding: 10, marginBottom: 20 }}>
        <H3>Standings</H3>
        <MutedText>{gameOver ? GAME_OVER : NEXT_ROUND}</MutedText>
        <List>{standingEntries}</List>
        {showButton && (
          <FlatButton
            primary={true}
            fullWidth={true}
            onClick={onClick}
            label={gameOver ? BUTTON.GAME_OVER : BUTTON.NEXT_ROUND}
          />
        )}
      </Paper>
    );
  }
}

const GAME_OVER = `The game is over and the final standings are clear!`;
const NEXT_ROUND = `What a great round! But the game is not over yet. Time for the next round!`;
const BUTTON = {
  GAME_OVER: 'Finish Game',
  NEXT_ROUND: 'Next Round'
};

export default ScoreScreen;

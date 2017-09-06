import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import styled from 'styled-components';

import Paper from 'material-ui/Paper';
import RaisedButton from 'material-ui/RaisedButton';
import FlatButton from 'material-ui/FlatButton';
import GroupAdd from 'material-ui/svg-icons/social/group-add';
import Gamepad from 'material-ui/svg-icons/hardware/gamepad';
import InfoOutline from 'material-ui/svg-icons/action/info-outline';

import { H3, MutedText } from '../components/common';

const Center = styled.div`
  display: flex;
  justify-content: space-around;
  align-items: center;
  flex-wrap: wrap;
`;

class Welcome extends Component {
  render() {
    return (
      <Paper zDepth={1} style={{ padding: 10, marginBottom: 20 }}>
        <H3>Welcome</H3>
        <MutedText>Welcome to Code against Humanity.</MutedText>
        <MutedText>
          This is a multiplayer game where you will be prompted with different
          code snippets. You'll have to write a comment at a specified place.
          Afterwards one of you will judge which one was the funniest. The
          person with the funniest comment will get a point and be the judge in
          the next round!
        </MutedText>
        <MutedText>May the funniest coder win!</MutedText>
        <Center>
          <Link to="/join">
            <RaisedButton icon={<GroupAdd />} label="Join Game" primary />
          </Link>
          <Link to="/create">
            <RaisedButton icon={<Gamepad />} label="New Game" primary />
          </Link>
          <Link to="/about">
            <FlatButton
              icon={<InfoOutline />}
              label="About the Game"
              primary
              style={{ marginTop: 10 }}
            />
          </Link>
        </Center>
      </Paper>
    );
  }
}

export default Welcome;

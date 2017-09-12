import React, { Component } from 'react';
import styled from 'styled-components';

import Paper from 'material-ui/Paper';
import RaisedButton from 'material-ui/RaisedButton';
import Code from 'material-ui/svg-icons/action/code';

import { H3, MutedText } from '../components/common';

const Center = styled.div`
  display: flex;
  justify-content: space-around;
  align-items: center;
  flex-wrap: wrap;
`;

class About extends Component {
  render() {
    return (
      <Paper zDepth={1} style={{ padding: 10, marginBottom: 20 }}>
        <H3>About Code against Humanity</H3>
        <MutedText>
          This is a game similar to "Cards against Humanity" or "Quiplash".
          You'll be presented with a series of code snippets. One person is the
          judge in every round. Everyone else submits a funny suggestion that
          replaces the ??? placeholder in the respective snippet. Afterwards the
          judge will decide on what's funniest for them. The winner will be the
          judge in the next round.
        </MutedText>
        <MutedText>
          The game is powered by{' '}
          <a href="https://www.twilio.com/sync" target="_blank">
            Twilio Sync
          </a>, React and Node.js.
        </MutedText>
        <MutedText>
          If you check out the source code you might find a few bugs/security
          holes that allow you to manipulate the flow of the game. The first
          person who creates an issue in the GitHub repository will receive a
          free ticket to{' '}
          <a href="https://www.twilio.com/signal/london" target="_blank">
            SIGNAL London
          </a>!
        </MutedText>
        <Center>
          <RaisedButton
            href="https://github.com/dkundel/code-against-humanity"
            target="_blank"
            label="Source Code"
            primary
            icon={<Code />}
          />
        </Center>
      </Paper>
    );
  }
}

export default About;

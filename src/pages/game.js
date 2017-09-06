import React, { Component } from 'react';

class Game extends Component {
  render() {
    return <pre>{JSON.stringify(this.props.match, '\n')}</pre>;
  }
}

export default Game;

/* {/* <Challenge code={codeString} title="Challenge #1" /> }
          {/* <Judging
            code={codeString}
            title="Challenge #1"
            submissions={exampleSubmissions}
          /> }
          {/* <ScoreScreen standings={standings} gameOver={false} /> }
          {/* <JoinGame /> }
          {/* <WaitingScreen
            message="We are currently waiting for 1 more member"
            confirmText="Let's go!"
            cancelText="Whatever"
          /> } */

const codeString = `
          function random() {
            return 4;
          }`.trim();

const exampleComments = [
  'Hello this is a very very very long comment',
  'This is a shorter one',
  'Hello hello',
  'Whaaaaaats up?'
];

const exampleSubmissions = exampleComments.map((s, idx) => ({
  id: idx,
  comment: s
}));

const standings = [
  { score: 500, name: 'Some Name' },
  { score: 400, name: 'Some Other Name' },
  { score: 300, name: 'Another Name' },
  { score: 99, name: 'Luke Skywalker' },
  { score: 9, name: 'Darth Vader' }
];

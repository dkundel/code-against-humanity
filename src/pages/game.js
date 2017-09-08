import React, { Component } from 'react';
import { stringify } from 'query-string';
import { sortBy } from 'lodash-es';

import Paper from 'material-ui/Paper';

import { H4, Li, MutedText } from '../components/common';
import CodeBlock from '../components/code-block';
import { post } from '../lib/utils';

import WaitingScreen from './waiting-screen';
import Challenge from './challenge';
import Judging from './judging';
import ScoreScreen from './score-screen';
import GameClient from '../lib/game-client';

class Game extends Component {
  constructor(...args) {
    super(...args);
    const { id: roomId } = this.props.match.params;
    const username = localStorage.getItem(`user:${roomId}`);

    this.state = {
      game: undefined,
      username,
      roomId
    };

    this.startGame = this.startGame.bind(this);
    this.judgeSubmissions = this.judgeSubmissions.bind(this);
    this.submitAnswer = this.submitAnswer.bind(this);
  }

  async componentDidMount() {
    const client = GameClient.shared();

    try {
      const { roomId, username } = this.state;
      await client.init(username, roomId);
    } catch (err) {
      console.error(err);
      return;
    }

    client.on('updated', ({ game }) => {
      this.setState({ game });
    });

    const game = client.getGame();
    this.setState({ game });
  }

  async startGame() {
    const { username, roomId } = this.state;
    const resp = await post('/api/game/start', { username, roomId });
    if (!resp.ok) {
      const msg = await resp.text();
      console.error(msg);
      return;
    }
  }

  async judgeSubmissions({ winner }) {
    const { username, roomId } = this.state;
    const resp = await post('/api/game/judge', { username, roomId, winner });
    if (!resp.ok) {
      const msg = await resp.text();
      console.error(msg);
      return;
    }
  }

  async submitAnswer({ submission: comment }) {
    const { username, roomId } = this.state;
    const resp = await post('/api/game/submit', { username, roomId, comment });
    if (!resp.ok) {
      const msg = await resp.text();
      console.error(msg);
      return;
    }
  }

  render() {
    if (this.shouldRenderWaitingForUsers()) {
      return this.renderWaitingForUsers();
    }

    if (this.shouldRenderWaitingForStart()) {
      return this.renderWaitingToStart();
    }

    if (this.shouldRenderStartGame()) {
      return this.renderStartGame();
    }

    if (this.shouldRenderScoreScreen()) {
      return this.renderScoreScreen();
    }

    if (this.shouldRenderFinishGame()) {
      return this.renderFinishGame();
    }

    if (this.shouldRenderSubmissionsScreen()) {
      return this.renderSubmissionsScreen();
    }

    if (this.shouldRenderWaitingForSubmissions()) {
      return this.renderWaitingForSubmissions();
    }

    if (this.shouldRenderJudgingScreen()) {
      return this.renderJudingScreen();
    }

    if (this.shouldRenderWaitingforJudging()) {
      return this.renderWaitingForJudging();
    }

    return <pre>{JSON.stringify(this.state.game, '\n')}</pre>;
  }

  renderWaitingForUsers() {
    const members = this.state.game.standings.map(({ username }) => (
      <Li key={`entry${username}`}>{username}</Li>
    ));
    const currentNumberOfMembers = members.length;

    return (
      <WaitingScreen>
        <MutedText>Still waiting for folks to join.</MutedText>
        <MutedText>
          Current number of participants {currentNumberOfMembers}/5:
        </MutedText>
        <ul>{members}</ul>
      </WaitingScreen>
    );
  }

  renderWaitingToStart() {
    const members = this.state.game.standings.map(({ username }) => (
      <Li key={`entry${username}`}>{username}</Li>
    ));
    const currentNumberOfMembers = members.length;

    return (
      <WaitingScreen>
        <MutedText>The game is full and ready to start.</MutedText>
        <MutedText>
          Waiting for the game creator to kick off the game.
        </MutedText>
        <MutedText>
          Current number of participants {currentNumberOfMembers}/5:
        </MutedText>
        <ul>{members}</ul>
      </WaitingScreen>
    );
  }

  renderStartGame() {
    const members = this.state.game.standings.map(({ username }) => (
      <Li key={`entry${username}`}>{username}</Li>
    ));
    const currentNumberOfMembers = members.length;

    return (
      <WaitingScreen
        confirmText="Start Game"
        onConfirm={() => this.startGame()}
      >
        <H4>
          Room ID: <code>{this.state.roomId}</code>
        </H4>
        <MutedText>
          Still waiting for folks to join. Give them the room ID above to join
          this game.
        </MutedText>
        <MutedText>
          Current number of participants {currentNumberOfMembers}/5:
        </MutedText>
        <ul>{members}</ul>
        <MutedText>
          You can start the game at any point even with less people.
        </MutedText>
      </WaitingScreen>
    );
  }

  renderScoreScreen() {
    const standings = sortBy(this.state.game.standings, ['score']);
    return <ScoreScreen standings={standings} gameOver={false} />;
  }

  renderFinishGame() {
    return <h3>Todo</h3>;
  }

  renderSubmissionsScreen() {
    const { currentQuestion } = this.state.game;
    return (
      <Challenge
        code={currentQuestion.snippet}
        title={currentQuestion.title}
        onSubmit={this.submitAnswer}
      />
    );
  }

  renderWaitingForSubmissions() {
    const { currentQuestion } = this.state.game;

    return (
      <WaitingScreen>
        <MutedText>
          Waiting for submissions for {currentQuestion.title}
        </MutedText>
        <Paper zDepth={2}>
          <CodeBlock code={currentQuestion.snippet} />
        </Paper>
      </WaitingScreen>
    );
  }

  renderJudingScreen() {
    const { currentQuestion, currentSubmissions } = this.state.game;
    return (
      <Judging
        code={currentQuestion.snippet}
        title={currentQuestion.title}
        submissions={currentSubmissions}
        onSubmit={this.judgeSubmissions}
      />
    );
  }

  renderWaitingForJudging() {
    return <h3>Todo</h3>;
  }

  isGameStatus(status) {
    return this.state && this.state.game && this.state.game.status === status;
  }

  isCurrentJudge() {
    return (
      this.state &&
      this.state.game &&
      this.state.game.currentJudge === this.state.username
    );
  }

  isCreator() {
    return (
      this.state &&
      this.state.game &&
      this.state.game.creator === this.state.username
    );
  }

  shouldRenderWaitingForUsers() {
    return this.isGameStatus('open') && !this.isCreator();
  }

  shouldRenderWaitingForStart() {
    return this.isGameStatus('waitingToStart') && !this.isCreator();
  }

  shouldRenderStartGame() {
    return (
      (this.isGameStatus('open') || this.isGameStatus('waitingToStart')) &&
      this.isCreator()
    );
  }

  shouldRenderScoreScreen() {
    return this.isGameStatus('showStandings');
  }

  shouldRenderFinishGame() {
    return this.isGameStatus('gameover');
  }

  shouldRenderSubmissionsScreen() {
    return this.isGameStatus('submitting') && !this.isCurrentJudge();
  }

  shouldRenderWaitingForSubmissions() {
    return this.isGameStatus('submitting') && this.isCurrentJudge();
  }

  shouldRenderJudgingScreen() {
    return this.isGameStatus('judging') && this.isCurrentJudge();
  }

  shouldRenderWaitingforJudging() {
    return this.isGameStatus('judging') && !this.isCurrentJudge();
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

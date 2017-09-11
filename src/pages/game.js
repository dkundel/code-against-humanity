import React, { Component } from 'react';
import { stringify } from 'query-string';
import { orderBy } from 'lodash-es';
import styled from 'styled-components';

import Paper from 'material-ui/Paper';

import { H4, Li, MutedText } from '../components/common';
import CodeBlock from '../components/code-block';
import { post } from '../lib/utils';

import WaitingScreen from './waiting-screen';
import Challenge from './challenge';
import Judging from './judging';
import ScoreScreen from './score-screen';
import WaitJudgingScreen from './wait-judging-screen';
import GameClient from '../lib/game-client';

const RoomCode = styled.code`
  font-size: 18px;
  font-weight: 200;
`;

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
    this.startNextRound = this.startNextRound.bind(this);
    this.finishGame = this.finishGame.bind(this);
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

  componentWillUpdate(_, nextState) {
    if (nextState.game.status === 'finished') {
      this.props.history.push('/');
    }
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

  async startNextRound() {
    GameClient.shared().set('status', 'submitting');
  }

  async finishGame() {
    GameClient.shared().set('status', 'finished');
  }

  render() {
    console.log(this.state.game);
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

    return <div />;
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
          Room ID: <RoomCode>{this.state.roomId}</RoomCode>
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
    const standings = orderBy(this.state.game.standings, ['score'], ['desc']);
    return (
      <ScoreScreen
        standings={standings}
        gameOver={false}
        showButton={this.isCreator()}
        onClick={this.startNextRound}
      />
    );
  }

  renderFinishGame() {
    const standings = orderBy(this.state.game.standings, ['score'], ['desc']);
    return (
      <ScoreScreen
        standings={standings}
        gameOver={true}
        showButton={this.isCreator()}
        onClick={this.finishGame}
      />
    );
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
    const { currentQuestion, currentSubmissions } = this.state.game;
    return (
      <WaitJudgingScreen
        code={currentQuestion.snippet}
        submissions={currentSubmissions}
      />
    );
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

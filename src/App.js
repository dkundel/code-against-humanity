import React, { Component } from 'react';
import styled from 'styled-components';
import { BrowserRouter as Router, Route, Link } from 'react-router-dom';

import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import RaisedButton from 'material-ui/RaisedButton';

import Challenge from './pages/challenge';
import Judging from './pages/judging';
import ScoreScreen from './pages/score-screen';
import JoinGame from './pages/join-game';
import NewGame from './pages/new-game';
import WaitingScreen from './pages/waiting-screen';
import Welcome from './pages/welcome';
import Game from './pages/game';

import Footer from './components/footer';
import { H1 } from './components/common';

import Theme from './lib/theme';

const Title = H1.extend``;
const AppContainer = styled.div`padding: 20px 10px;`;

const LogoContainer = styled.div`
  text-align: center;
  width: 100%;
`;
const Logo = styled.img`max-width: 250px;`;

class App extends Component {
  render() {
    return (
      <MuiThemeProvider muiTheme={Theme}>
        <AppContainer>
          <LogoContainer>
            <Logo src="/cah-logo.png" alt="Code against Humanity" />
          </LogoContainer>
          <Router>
            <div>
              <Route path="/" exact component={Welcome} />
              <Route path="/join" component={JoinGame} />
              <Route path="/create" component={NewGame} />
              <Route path="/game/:id" component={Game} />
            </div>
          </Router>
          <Footer style={{ textAlign: 'center' }} />
        </AppContainer>
      </MuiThemeProvider>
    );
  }
}

export default App;

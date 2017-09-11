import React, { Component } from 'react';
import styled from 'styled-components';

import Paper from 'material-ui/Paper';
import CircularProgress from 'material-ui/CircularProgress';
import FlatButton from 'material-ui/FlatButton';
import RaisedButton from 'material-ui/RaisedButton';

import { H3, MutedText } from '../components/common';

const Center = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 40px;
`;

class WaitingScreen extends Component {
  render() {
    const {
      message,
      confirmText,
      cancelText,
      onConfirm,
      onCancel,
      children
    } = this.props;

    const hasConfirmButton =
      typeof confirmText === 'string' && confirmText.length !== 0;
    const hasCancelButton =
      typeof cancelText === 'string' && cancelText.length !== 0;

    return (
      <Paper zDepth={1} style={{ padding: 10, marginBottom: 20 }}>
        <H3>Waiting...</H3>
        {message ? <MutedText>{message}</MutedText> : children}
        <Center>
          <CircularProgress />
        </Center>
        {hasConfirmButton && (
          <RaisedButton
            primary
            fullWidth
            onClick={onConfirm}
            label={confirmText}
          />
        )}
        {hasCancelButton && (
          <FlatButton
            fullWidth
            onClick={onCancel}
            style={{ marginTop: 20 }}
            label={cancelText}
          />
        )}
      </Paper>
    );
  }
}

export default WaitingScreen;

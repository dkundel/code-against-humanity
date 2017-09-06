import React, { Component } from 'react';
import styled from 'styled-components';
import RaisedButton from 'material-ui/RaisedButton';
import Paper from 'material-ui/Paper';
import TextField from 'material-ui/TextField';

import CodeBlock from '../components/code-block';
import { H3, H4 } from '../components/common';

class Challenge extends Component {
  render() {
    const { code, title } = this.props;
    return (
      <Paper zDepth={1} style={{ padding: 10, marginBottom: 20 }}>
        <H3>{title}</H3>
        <Paper zDepth={2}>
          <CodeBlock code={code} />
        </Paper>
        <TextField
          floatingLabelFixed={true}
          floatingLabelText="Enter your comment:"
          fullWidth={true}
        />
        <RaisedButton primary={true} style={{ marginTop: 10 }}>
          Submit
        </RaisedButton>
      </Paper>
    );
  }
}

export default Challenge;

import React, { Component } from 'react';
import styled from 'styled-components';
import RaisedButton from 'material-ui/RaisedButton';
import Paper from 'material-ui/Paper';
import TextField from 'material-ui/TextField';

import CodeBlock from '../components/code-block';
import { H3, H4 } from '../components/common';

class Challenge extends Component {
  constructor(...args) {
    super(...args);
    this.state = {
      currentValue: undefined
    };
    this.submit = this.submit.bind(this);
    this.updateInput = this.updateInput.bind(this);
  }

  updateInput(evt) {
    const currentValue = evt.target.value;
    this.setState({ currentValue });
  }

  submit() {
    this.props.onSubmit({ submission: this.state.currentValue });
  }

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
          onChange={this.updateInput}
        />
        <RaisedButton
          primary={true}
          style={{ marginTop: 10 }}
          onClick={this.submit}
        >
          Submit
        </RaisedButton>
      </Paper>
    );
  }
}

export default Challenge;

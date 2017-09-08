import React, { Component } from 'react';
import styled from 'styled-components';
import RaisedButton from 'material-ui/RaisedButton';
import Paper from 'material-ui/Paper';
import Subheader from 'material-ui/Subheader';
import List from 'material-ui/List';
import Divider from 'material-ui/Divider';

import CodeBlock from '../components/code-block';
import SubmissionEntry from '../components/submission-entry';
import { H2, H3, H4 } from '../components/common';

class Judging extends Component {
  constructor() {
    super();

    this.state = this.state || {};
    this.state.currentlySelected = null;

    this.submit = this.submit.bind(this);
  }

  submit() {
    this.props.onSubmit({ winner: this.state.currentlySelected });
  }

  render() {
    const { code, title, submissions } = this.props;
    const { currentlySelected } = this.state;

    const listEntries = submissions.map(s => {
      const selected = s.id === currentlySelected;
      const onSelect = () => {
        const newlySelected = currentlySelected === s.id ? null : s.id;
        this.setState({
          currentlySelected: newlySelected
        });
      };

      return (
        <div>
          <SubmissionEntry selected={selected} onSelect={onSelect} key={s.id}>
            {s.comment}
          </SubmissionEntry>
          <Divider key={'divider' + s.id} />
        </div>
      );
    });

    return (
      <Paper zDepth={1} style={{ padding: 10, marginBottom: 20 }}>
        <H4>Judging Submission:</H4>
        <H3>{title}</H3>
        <Paper zDepth={2}>
          <CodeBlock code={code} />
        </Paper>
        <H4>Submissions:</H4>
        <List>
          <Divider />
          {listEntries}
        </List>
        <RaisedButton primary={true} fullWidth={true} onClick={this.submit}>
          Submit
        </RaisedButton>
      </Paper>
    );
  }
}

export default Judging;

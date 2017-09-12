import React from 'react';

import Paper from 'material-ui/Paper';
import List from 'material-ui/List';
import Divider from 'material-ui/Divider';

import CodeBlock from '../components/code-block';
import { MutedText } from '../components/common';
import SubmissionEntry from '../components/submission-entry';

import WaitingScreen from './waiting-screen';

const WaitJudgingScreen = function({ submissions, code, language }) {
  const listEntries = submissions.map(s => (
    <div>
      <SubmissionEntry key={s.id} hideHeart={true}>
        {s.comment}
      </SubmissionEntry>
      <Divider key={'divider' + s.id} />
    </div>
  ));
  return (
    <WaitingScreen>
      <MutedText>
        The judge is currently the submissions. Here are the submissions:
      </MutedText>
      <Paper zDepth={2}>
        <CodeBlock code={code} language={language} />
      </Paper>
      <List>{listEntries}</List>
    </WaitingScreen>
  );
};

export default WaitJudgingScreen;

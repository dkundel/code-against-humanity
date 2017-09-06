import React from 'react';
import SyntaxHighlighter from 'react-syntax-highlighter';
import { dracula } from 'react-syntax-highlighter/dist/styles';

const CodeBlock = ({ code }) => {
  return (
    <SyntaxHighlighter language="javascript" style={dracula}>
      {code}
    </SyntaxHighlighter>
  );
};

export default CodeBlock;

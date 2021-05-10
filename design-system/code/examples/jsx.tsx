import React from 'react';

import { CodeBlock } from '../src';

const exampleCodeBlock = `/** @jsx jsx */
import React from 'react';
import ReactDOM from 'react-dom';
import styled from '@emotion/styled';
import { jsx } from '@emotion/react';
import { N800 } from '@atlaskit/theme/colors';

// TODO refactor
const Content = styled.div\`
  color: \${N800};
  margin-top: 8px !important;
\`;

class HelloMessage extends React.Component {
  render() {
    return (
      <Content css={{ background: "green" }}>Hello {this.props.name}</Content>
    );
  }
}

ReactDOM.render(<HelloMessage name="Taylor" />, document.body);`;

export default function Component() {
  return (
    <div>
      <h2>JSX</h2>
      <CodeBlock language="jsx" text={exampleCodeBlock} />
    </div>
  );
}

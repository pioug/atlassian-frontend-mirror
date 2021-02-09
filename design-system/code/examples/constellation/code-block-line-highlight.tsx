import React from 'react';

import { CodeBlock } from '../../src';

const exampleCodeBlock = `class HelloMessage extends React.Component {
  render() {
    return (
      <div>
        Hello {this.props.name}
      </div>
    );
  }
}

ReactDOM.render(
  <HelloMessage name="Taylor" />,
  mountNode
);`;

export default function CodeBlockLineHighlightExample() {
  return (
    <CodeBlock
      language="javascript"
      text={exampleCodeBlock}
      highlight="2,5-7"
    />
  );
}

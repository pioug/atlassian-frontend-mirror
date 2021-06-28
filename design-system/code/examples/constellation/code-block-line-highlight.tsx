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

const CodeBlockLineHighlightExample = () => {
  return <CodeBlock language="jsx" text={exampleCodeBlock} highlight="2,5-7" />;
};

export default CodeBlockLineHighlightExample;

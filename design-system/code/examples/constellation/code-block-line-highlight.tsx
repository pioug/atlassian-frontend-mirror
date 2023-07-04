import React from 'react';

import { CodeBlock } from '../../src';

const exampleCodeBlock = `class HelloMessage extends React.Component {
  import { Box } from '@atlaskit/primitives'
 
  render() {
    return (
      <Box>
        Hello {this.props.name}
      </Box>
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

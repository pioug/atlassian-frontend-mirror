import React from 'react';

import { CodeBlock } from '@atlaskit/code';

const exampleCodeBlock = `import { Box } from '@atlaskit/primitives

class HelloMessage extends React.Component {
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

const CodeBlockDefaultExample = () => {
	return <CodeBlock language="jsx" showLineNumbers={false} text={exampleCodeBlock} />;
};

export default CodeBlockDefaultExample;

import React from 'react';

import CodeBlock from '@atlaskit/code/code-block';

const exampleCodeBlock = `import { Box } from '@atlaskit/primitives/compiled'

class HelloMessage extends React.Component {
  render() {
    return (
      <Box>
        Hello {this.props.name}
      </Box>
    );
  }
}

const root = createRoot(mountNode);
root.render(<HelloMessage name="Taylor" />);`;

const CodeBlockLineNumbersExample = (): React.JSX.Element => {
	return <CodeBlock language="jsx" text={exampleCodeBlock} />;
};

export default CodeBlockLineNumbersExample;

import React from 'react';

import CodeBlock from '@atlaskit/code/code-block';

const exampleCodeBlock = `class HelloMessage extends React.Component {
  import { Box } from '@atlaskit/primitives/compiled'

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

const CodeBlockLineHighlightExample = (): React.JSX.Element => {
	return <CodeBlock language="jsx" text={exampleCodeBlock} highlight="2,5-7" />;
};

export default CodeBlockLineHighlightExample;

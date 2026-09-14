import React from 'react';

import CodeBlock from '@atlaskit/code/code-block';

const exampleCodeBlock = `	<Box>
		Hello {this.props.name} // <- Bug on this line
	</Box>`;

const CodeBlockLineNumbersExample = (): React.JSX.Element => {
	return <CodeBlock language="jsx" firstLineNumber={139} text={exampleCodeBlock} />;
};

export default CodeBlockLineNumbersExample;

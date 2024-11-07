import React from 'react';

import { CodeBlock } from '@atlaskit/code';

const exampleCodeBlock = `	<Box>
		Hello {this.props.name} // <- Bug on this line
	</Box>`;

const CodeBlockLineNumbersExample = () => {
	return <CodeBlock language="jsx" firstLineNumber={139} text={exampleCodeBlock} />;
};

export default CodeBlockLineNumbersExample;

import React from 'react';

import CodeBlock from '@atlaskit/code/code-block';

const exampleCodeBlock = `// React Component
class HelloMessage extends React.Component {
	render() {
		return (
			<div>
				Hello {this.props.name}
			</div>
		);
	}
}

const root = createRoot(mountNode);
root.render(<HelloMessage name="Taylor" />);`;

export default function Component(): React.JSX.Element {
	return (
		<div>
			<h2>Showing code without line numbers</h2>
			<CodeBlock language="jsx" text={exampleCodeBlock} showLineNumbers={false} />

			<h2>Showing code with line numbers</h2>
			<CodeBlock language="jsx" text={exampleCodeBlock} />

			<h2>Highlighting specific lines</h2>
			<CodeBlock language="jsx" text={exampleCodeBlock} highlight="2,5-7,12-15" />
		</div>
	);
}

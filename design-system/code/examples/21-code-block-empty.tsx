import React from 'react';

import { Code, CodeBlock } from '@atlaskit/code';

export default function Component() {
	return (
		<div>
			<div data-testid="empty-codeblocks">
				<h2>Empty string</h2>
				<CodeBlock text="" testId="emptyString" />

				<h2>Empty string without line numbers</h2>
				<CodeBlock text="" showLineNumbers={false} />

				<h2>Empty string without line numbers and test ID</h2>
				{/* A test ID causes an extra span to be added */}
				<CodeBlock text="" showLineNumbers={false} testId="emptyStringTestID" />
			</div>

			<h2>Not empty</h2>
			<p>
				With a space <Code>" "</Code>
			</p>
			<CodeBlock text=" " showLineNumbers={false} />
		</div>
	);
}

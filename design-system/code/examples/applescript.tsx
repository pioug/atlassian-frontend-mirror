import React from 'react';

import { CodeBlock } from '@atlaskit/code';

const exampleCodeBlock = `12 + 2 * 5
"DUMPtruck" is equal to "dumptruck"`;

export default function Component(): React.JSX.Element {
	return (
		<div>
			<h2>AppleScript</h2>
			<CodeBlock language="applescript" text={exampleCodeBlock} />
		</div>
	);
}

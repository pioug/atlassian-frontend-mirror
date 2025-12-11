import React from 'react';

import { CodeBlock } from '@atlaskit/code';

const exampleCodeBlock = `procedure ShowTime;
// A procedure with no parameters`;

export default function Component(): React.JSX.Element {
	return (
		<div>
			<h2>Delphi</h2>
			<CodeBlock language="delphi" text={exampleCodeBlock} />
		</div>
	);
}

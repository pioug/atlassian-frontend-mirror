import React from 'react';

import { CodeBlock } from '@atlaskit/code';

const exampleCodeBlock = `ASSERT nParm != 0 MESSAGE "Received a parameter of 0"`;

export default function Component() {
	return (
		<div>
			<h2>FoxPro</h2>
			<CodeBlock language="foxpro" text={exampleCodeBlock} />
		</div>
	);
}

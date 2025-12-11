import React from 'react';

import { CodeBlock } from '@atlaskit/code';

const exampleCodeBlock = `-  const woah = fun => fun + 1;
+  const dude = woah(2) + 3;
function thisIsAFunction() {
  return [1,2,3].map(n => n + 1).filter(n !== 3);
}`;

export default function Component(): React.JSX.Element {
	return (
		<div>
			<h2>Diff</h2>
			<CodeBlock language="diff" text={exampleCodeBlock} />
		</div>
	);
}

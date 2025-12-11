import React from 'react';

import { CodeBlock } from '@atlaskit/code';

const exampleCodeBlock = `signature REGEXP = sig
  val format : regexp -> string
end`;

export default function Component(): React.JSX.Element {
	return (
		<div>
			<h2>Standard ML</h2>
			<CodeBlock language="standardml" text={exampleCodeBlock} />
		</div>
	);
}

import React from 'react';

import { CodeBlock } from '@atlaskit/code';

const exampleCodeBlock = `(ns learnclojure)
(str "Hello" " " "World") ; => "Hello World"`;

export default function Component(): React.JSX.Element {
	return (
		<div>
			<h2>Clojure</h2>
			<CodeBlock language="clojure" text={exampleCodeBlock} />
		</div>
	);
}

import React from 'react';

import { CodeBlock } from '@atlaskit/code';

const exampleCodeBlock = `Name: {{name}}
Occupation: {{occupation}}
Hobbies:
{{#items}}
- {{name}}
{{/items}}`;

export default function Component() {
	return (
		<div>
			<h2>Handlebars</h2>
			<CodeBlock language="mustache" text={exampleCodeBlock} />
		</div>
	);
}

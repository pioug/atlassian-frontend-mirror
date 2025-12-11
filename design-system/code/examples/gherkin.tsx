import React from 'react';

import { CodeBlock } from '@atlaskit/code';

const exampleCodeBlock = `Scenario Outline: eating
  Given there are <start> cucumbers
  When I eat <eat> cucumbers
  Then I should have <left> cucumbers

  Examples:
    | start | eat | left |
    |    12 |   5 |    7 |
    |    20 |   5 |   15 |`;

export default function Component(): React.JSX.Element {
	return (
		<div>
			<h2>Gherkin</h2>
			<CodeBlock language="gherkin" text={exampleCodeBlock} />
		</div>
	);
}

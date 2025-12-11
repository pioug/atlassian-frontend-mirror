import React from 'react';

import { CodeBlock } from '@atlaskit/code';
import { Stack } from '@atlaskit/primitives/compiled';

const exampleCodeBlock = `def factorial(n):
"""
This multiline comment should appear green whether it has code wrapping on or off, regardless of whether a testId is applied. This example exists to demonstrate an edge case that wasn't found until QA testing with python lang.

Calculates the factorial of a given number n.

Args:
n: An integer

Returns:
The factorial of n
"""

if n == 0:
    return 1
else:
    return n * factorial(n-1)`;

const CodeBlockShouldWrapLongLinesExample = (): React.JSX.Element => {
	return (
		<Stack testId="testid-and-wrapping-with-python">
			<h2>Wrapping on, with a testId</h2>
			<CodeBlock
				testId="test"
				language="python"
				text={exampleCodeBlock}
				shouldWrapLongLines={true}
				highlight="3"
			/>
			<h2>Wrapping on, without a testId</h2>
			<CodeBlock
				language="python"
				text={exampleCodeBlock}
				shouldWrapLongLines={true}
				highlight="3"
			/>
			<h2>Wrapping off, with a testId</h2>
			<CodeBlock
				testId="test2"
				language="python"
				text={exampleCodeBlock}
				shouldWrapLongLines={false}
				highlight="3"
			/>
			<h2>Wrapping off, without a testId</h2>
			<CodeBlock
				language="python"
				text={exampleCodeBlock}
				shouldWrapLongLines={false}
				highlight="3"
			/>
		</Stack>
	);
};

export default CodeBlockShouldWrapLongLinesExample;

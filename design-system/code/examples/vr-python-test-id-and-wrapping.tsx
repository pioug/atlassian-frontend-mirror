import React from 'react';

import { Stack } from '@atlaskit/primitives';

import { CodeBlock } from '../src';

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

const CodeBlockShouldWrapLongLinesExample = () => {
  return (
    <Stack testId="testid-and-wrapping-with-python">
      <b>Wrapping on, with a testId</b>
      <CodeBlock
        testId="test"
        language="python"
        text={exampleCodeBlock}
        shouldWrapLongLines={true}
        highlight="3"
      />
      <b>Wrapping on, without a testId</b>
      <CodeBlock
        language="python"
        text={exampleCodeBlock}
        shouldWrapLongLines={true}
        highlight="3"
      />
      <b>Wrapping off, with a testId</b>
      <CodeBlock
        testId="test2"
        language="python"
        text={exampleCodeBlock}
        shouldWrapLongLines={false}
        highlight="3"
      />
      <b>Wrapping off, without a testId</b>
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

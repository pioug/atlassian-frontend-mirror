import React, { useCallback, useState } from 'react';

import Button from '@atlaskit/button/new';
import { Code } from '@atlaskit/code';
import Heading from '@atlaskit/heading';
import { Box, Flex, Stack } from '@atlaskit/primitives';

import ExampleBox from '../shared/example-box';

const alignmentValues = ['start', 'center', 'end'] as const;

export default function Example() {
  const [alignmentIndex, setAlignmentIndex] = useState<0 | 1 | 2>(0);
  const nextIndex = ((alignmentIndex + 1) % alignmentValues.length) as
    | 0
    | 1
    | 2;
  const changeAlignment = useCallback(() => {
    setAlignmentIndex(nextIndex);
  }, [nextIndex]);
  return (
    <Stack space="space.500">
      <Box>
        <Button onClick={changeAlignment}>
          Change alignment to "{alignmentValues[nextIndex]}"
        </Button>
      </Box>
      <Stack space="space.100">
        <Heading level="h400">
          Justify content <Code>{alignmentValues[alignmentIndex]}</Code>
        </Heading>
        <Flex gap="space.100" justifyContent={alignmentValues[alignmentIndex]}>
          <ExampleBox />
          <ExampleBox />
          <ExampleBox />
        </Flex>
      </Stack>
    </Stack>
  );
}

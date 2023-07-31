import React, { useState } from 'react';

import Button from '@atlaskit/button';
import { Code } from '@atlaskit/code';
import Heading from '@atlaskit/heading';
import { Box, Flex, Stack } from '@atlaskit/primitives';

import Block from '../shared/block';

export default function Example() {
  const [direction, setDirection] = useState<'row' | 'column'>('row');

  return (
    <Stack space="space.500">
      <Box>
        <Button
          onClick={() =>
            setDirection(oldDirection =>
              oldDirection === 'row' ? 'column' : 'row',
            )
          }
        >
          Change direction to "{direction === 'row' ? 'column' : 'row'}"
        </Button>
      </Box>
      <Stack space="space.100">
        <Heading level="h400">
          Flex direction <Code>{direction}</Code>
        </Heading>
        <Flex gap="space.100" direction={direction}>
          <Block />
          <Block />
          <Block />
        </Flex>
      </Stack>
    </Stack>
  );
}

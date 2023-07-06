import React, { useState } from 'react';

import Button from '@atlaskit/button';
import Heading from '@atlaskit/heading';
import { Box, Flex, Stack } from '@atlaskit/primitives';

import Square from '../shared/square';

export default function Example() {
  const [direction, setDirection] = useState<'row' | 'column'>('row');

  return (
    <Stack space="space.500">
      <Box>
        <Button
          onClick={() =>
            setDirection(old => (old === 'row' ? 'column' : 'row'))
          }
        >
          Change direction to "{direction === 'row' ? 'column' : 'row'}"
        </Button>
      </Box>
      <Stack space="space.100">
        <Heading level="h400">Flex direction</Heading>
        <Flex gap="space.100" direction={direction}>
          <Square />
          <Square />
          <Square />
        </Flex>
      </Stack>
    </Stack>
  );
}

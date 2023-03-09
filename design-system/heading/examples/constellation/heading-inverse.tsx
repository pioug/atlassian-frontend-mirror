import React, { useState } from 'react';

import { Label } from '@atlaskit/form';
import { Box, Stack } from '@atlaskit/primitives';
import Toggle from '@atlaskit/toggle';

import Heading from '../../src';

export default () => {
  const [isInverse, setIsInverse] = useState(true);
  const color = isInverse ? 'inverse' : undefined;

  return (
    <Stack space="100">
      <Box padding="space.100">
        <Label htmlFor="colorToggle">Is inverse</Label>
        <Toggle
          id="colorToggle"
          onChange={() => setIsInverse(!isInverse)}
          isChecked={isInverse}
        />
      </Box>
      <Box padding="space.100" backgroundColor={'accent.gray.subtler'}>
        <Heading color={color} level="h900">
          H900
        </Heading>
      </Box>
    </Stack>
  );
};

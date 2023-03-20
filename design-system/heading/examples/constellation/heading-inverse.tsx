import React, { useState } from 'react';

import {
  UNSAFE_Box as Box,
  UNSAFE_Inline as Inline,
  UNSAFE_Stack as Stack,
} from '@atlaskit/ds-explorations';
import { Label } from '@atlaskit/form';
import Toggle from '@atlaskit/toggle';

import Heading from '../../src';

export default () => {
  const [isInverse, setIsInverse] = useState(true);
  const color = isInverse ? 'inverse' : undefined;

  return (
    <Stack gap="space.100">
      <Box padding="space.100">
        <Inline alignItems="center" gap={'space.0'}>
          <Label htmlFor="colorToggle">Is inverse</Label>
          <Toggle
            id="colorToggle"
            onChange={() => setIsInverse(!isInverse)}
            isChecked={isInverse}
          />
        </Inline>
      </Box>
      <Box padding="space.100" backgroundColor="neutral.bold">
        <Heading color={color} level="h900">
          H900
        </Heading>
      </Box>
    </Stack>
  );
};

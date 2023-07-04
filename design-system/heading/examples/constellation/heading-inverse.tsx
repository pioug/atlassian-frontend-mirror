/** @jsx jsx */
import { useState } from 'react';

import { jsx } from '@emotion/react';

import { Label } from '@atlaskit/form';
import { Box, Inline, Stack, xcss } from '@atlaskit/primitives';
import Toggle from '@atlaskit/toggle';

import Heading from '../../src';

const headingContainerStyles = xcss({
  padding: 'space.100',
  backgroundColor: 'color.background.neutral.bold',
});

export default () => {
  const [isInverse, setIsInverse] = useState(true);
  const color = isInverse ? 'inverse' : undefined;

  return (
    <Stack space="space.100">
      <Inline alignBlock="center">
        <Label htmlFor="colorToggle">Is inverse</Label>
        <Toggle
          id="colorToggle"
          onChange={() => setIsInverse(!isInverse)}
          isChecked={isInverse}
        />
      </Inline>
      <Box xcss={headingContainerStyles}>
        <Heading color={color} level="h900">
          H900
        </Heading>
      </Box>
    </Stack>
  );
};

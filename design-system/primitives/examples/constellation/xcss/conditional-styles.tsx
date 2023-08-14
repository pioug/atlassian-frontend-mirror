import React, { useState } from 'react';

import { Box, Inline, xcss } from '@atlaskit/primitives';
import Toggle from '@atlaskit/toggle';

const baseStyles = xcss({
  paddingBlock: 'space.500',
  width: '100%',
  borderRadius: 'border.radius',
});

const theseStyles = xcss({
  backgroundColor: 'color.background.accent.blue.bolder',
});

const thoseStyles = xcss({
  backgroundColor: 'color.background.accent.green.bolder',
});

export default function ConditionalStyles() {
  const [theseOrThose, setTheseOrThoseStyles] = useState(false);

  return (
    <Box testId="example" padding="space.200">
      <Inline alignBlock="center">
        <p>Toggle background color:</p>
        <Toggle onChange={() => setTheseOrThoseStyles(!theseOrThose)} />
      </Inline>
      <Box xcss={[baseStyles, theseOrThose ? theseStyles : thoseStyles]} />
    </Box>
  );
}

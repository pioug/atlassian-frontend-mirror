import React from 'react';

import { Box } from '@atlaskit/primitives';
import { token } from '@atlaskit/tokens';

import Button from '../src/new-button/variants/default/button';

export default function AutoFocusExample() {
  return (
    // to capture focus we need the padding
    <Box testId="button" style={{ padding: token('space.200', '16px') }}>
      <Button appearance="primary" autoFocus>
        Button
      </Button>
    </Box>
  );
}

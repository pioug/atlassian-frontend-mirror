import React from 'react';

import { token } from '@atlaskit/tokens';

import Button from '../src/button';

export default () => (
  // to capture focus we need the padding
  <div data-testid="button" style={{ padding: token('space.200', '16px') }}>
    <Button appearance="primary" autoFocus>
      Button
    </Button>
  </div>
);

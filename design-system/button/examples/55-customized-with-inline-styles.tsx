import React from 'react';

import { token } from '@atlaskit/tokens';

import Button from '../src/button';

export default () => (
  <Button
    style={{
      backgroundColor: token('color.background.accent.red.subtle', 'pink'),
    }}
  >
    Pink button
  </Button>
);

import React from 'react';

import { token } from '@atlaskit/tokens';

import Button from '../src/old-button/button';

export default () => (
  <Button
    style={{
      backgroundColor: token('color.background.accent.red.subtle', 'pink'),
    }}
  >
    Pink button
  </Button>
);

import React from 'react';

import { token } from '@atlaskit/tokens';

import Button from '../src/old-button/button';

export default () => (
  <Button
    style={{
// eslint-disable-next-line @atlaskit/ui-styling-standard/enforce-style-prop -- Ignored via go/DSP-18766
      backgroundColor: token('color.background.accent.red.subtle'),
    }}
  >
    Pink button
  </Button>
);

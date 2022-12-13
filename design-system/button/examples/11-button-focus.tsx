import React from 'react';

import Button from '../src/button';

export default () => (
  // to capture focus we need the padding
  <div data-testid="button" style={{ padding: 16 }}>
    <Button appearance="primary" autoFocus>
      Button
    </Button>
  </div>
);

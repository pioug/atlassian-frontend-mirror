import React from 'react';
import Spinner from '@atlaskit/spinner';

export const exampleSpinner = (
  <div style={{ height: '100%', width: '100%', position: 'relative' }}>
    <div style={{ position: 'absolute', top: '50%', left: '50%' }}>
      <Spinner size="large" />
    </div>
  </div>
);

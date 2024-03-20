import React from 'react';
import Spinner from '@atlaskit/spinner';

export const exampleSpinner = (
  <div style={{ height: '100%', width: '100%', position: 'relative' }}>
    <div
      style={{
        display: 'flex',
        justifyContent: 'center',
        height: '100%',
        alignItems: 'center',
      }}
    >
      <Spinner size="large" />
    </div>
  </div>
);

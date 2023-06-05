import React from 'react';

import { token } from '@atlaskit/tokens';

import Portal from '../src';

const PortalPerformance = () => {
  return (
    <Portal zIndex={200}>
      <div
        style={{
          position: 'absolute',
          top: token('space.300', '24px'),
          left: token('space.300', '24px'),
          // eslint-disable-next-line @atlaskit/design-system/ensure-design-token-usage
          background: 'lightpink',
          padding: token('space.300', '24px'),
          borderRadius: '3px',
          // this z-index is relative to the portal
          zIndex: 1,
        }}
      >
        <p>portal z-index: 200</p>
        <p>element z-index: 1</p>
      </div>
    </Portal>
  );
};

export default PortalPerformance;

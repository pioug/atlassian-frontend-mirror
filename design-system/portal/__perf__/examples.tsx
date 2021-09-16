import React from 'react';

import Portal from '../src';

const PortalPerformance = () => {
  return (
    <Portal zIndex={200}>
      <div
        style={{
          position: 'absolute',
          top: 24,
          left: 24,
          // eslint-disable-next-line @atlaskit/design-system/ensure-design-token-usage
          background: 'lightpink',
          padding: '24px',
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

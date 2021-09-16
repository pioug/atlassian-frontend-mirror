import React from 'react';

import Portal from '../src';

const StackingContextExample = () => (
  <div>
    <p>
      Each Portal component creates a new{' '}
      <a href="https://developer.mozilla.org/en-US/docs/Web/CSS/CSS_Positioning/Understanding_z_index/The_stacking_context">
        Stacking Context
      </a>
      . Elements rendered with z-indexes inside the Portal are scoped to that
      context.
    </p>
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
    <Portal zIndex={100}>
      <div
        style={{
          position: 'absolute',
          top: 100,
          left: 100,
          // eslint-disable-next-line @atlaskit/design-system/ensure-design-token-usage
          background: 'aquamarine',
          padding: '24px',
          borderRadius: '3px',
          // this z-index is relative to the portal
          zIndex: 1000,
        }}
      >
        <p>portal z-index: 100</p>
        <p>element z-index: 1000</p>
      </div>
    </Portal>
  </div>
);

export default StackingContextExample;

import React from 'react';

import { token } from '@atlaskit/tokens';

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
          top: token('space.300', '24px'),
          left: token('space.300', '24px'),
          padding: token('space.300', '24px'),
          background: 'lightpink',
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
          // eslint-disable-next-line @atlaskit/design-system/ensure-design-token-usage-spacing
          top: 100,
          // eslint-disable-next-line @atlaskit/design-system/ensure-design-token-usage-spacing
          left: 100,
          background: 'aquamarine',
          padding: token('space.300', '24px'),
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

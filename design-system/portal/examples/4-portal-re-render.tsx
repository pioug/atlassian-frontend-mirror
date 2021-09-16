import React, { useState } from 'react';

import Button from '@atlaskit/button/standard-button';

import Portal from '../src';

export default function BasicPortalExample() {
  const [zIndexes, setzIndex] = useState({ zIndex1: 100, zIndex2: 200 });
  const [child, setChild] = useState(1);
  return (
    <>
      <div>
        <Button
          id="toggleZIndexBtn"
          appearance={'primary'}
          style={{ margin: '0px 24px' }}
          onClick={() =>
            setzIndex({ zIndex1: zIndexes.zIndex2, zIndex2: zIndexes.zIndex1 })
          }
        >
          Toggle z-index
        </Button>
        <Button
          id="changeChildValue"
          appearance={'primary'}
          onClick={() => setChild(child + 1)}
        >
          Change child value of Portal 2
        </Button>
      </div>
      <Portal zIndex={zIndexes.zIndex1}>
        <div
          style={{
            position: 'absolute',
            top: 54,
            left: 24,
            // eslint-disable-next-line @atlaskit/design-system/ensure-design-token-usage
            background: 'lightpink',
            padding: '24px',
            borderRadius: '3px',
            zIndex: zIndexes.zIndex2,
          }}
        >
          <p>portal z-index: {zIndexes.zIndex1}</p>
          <p>element z-index: {zIndexes.zIndex2}</p>
        </div>
      </Portal>
      <Portal zIndex={zIndexes.zIndex2}>
        <div
          style={{
            position: 'absolute',
            top: 130,
            left: 100,
            // eslint-disable-next-line @atlaskit/design-system/ensure-design-token-usage
            background: 'aquamarine',
            padding: '24px',
            borderRadius: '3px',
            zIndex: zIndexes.zIndex1,
          }}
        >
          <p>portal z-index: {zIndexes.zIndex2}</p>
          <p>element z-index: {zIndexes.zIndex1}</p>
          <p>Child value: {child}</p>
        </div>
      </Portal>
    </>
  );
}

import React, { useState } from 'react';

import Button from '@atlaskit/button/new';
import { Box, Inline } from '@atlaskit/primitives';
import { token } from '@atlaskit/tokens';

import Portal from '../src';

export default function BasicPortalExample() {
  const [zIndexes, setzIndex] = useState({ zIndex1: 100, zIndex2: 200 });
  const [child, setChild] = useState(1);
  return (
    <>
      <Box paddingInline="space.300">
        <Inline space="space.300">
          <Button
            id="toggleZIndexBtn"
            appearance={'primary'}
            onClick={() =>
              setzIndex({
                zIndex1: zIndexes.zIndex2,
                zIndex2: zIndexes.zIndex1,
              })
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
        </Inline>
      </Box>
      <Portal zIndex={zIndexes.zIndex1}>
        <div
          style={{
            position: 'absolute',
            // eslint-disable-next-line @atlaskit/design-system/ensure-design-token-usage
            top: 54,
            left: token('space.300', '24px'),
            background: 'lightpink',
            padding: token('space.300', '24px'),
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
            // eslint-disable-next-line @atlaskit/design-system/ensure-design-token-usage
            top: 130,
            // eslint-disable-next-line @atlaskit/design-system/ensure-design-token-usage
            left: 100,
            background: 'aquamarine',
            padding: token('space.300', '24px'),
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

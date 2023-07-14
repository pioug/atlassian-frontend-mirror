import React, { FC, ReactNode } from 'react';

import { Box, Inline, xcss } from '@atlaskit/primitives';

const overlayStyles = xcss({
  display: 'flex',
  position: 'absolute',
  inset: 'space.0',
  left: 'space.400',
});

/**
 * __Bulk action overlay__
 *
 * A bulk action overlay is used to conditionally render when a user makes a row selection
 */
export const BulkActionOverlay: FC<{ children: ReactNode }> = ({
  children,
}) => (
  <Box
    // @ts-expect-error should box support table elements?
    as="th"
    paddingInline="space.100"
    backgroundColor="elevation.surface"
    xcss={overlayStyles}
  >
    <Inline space="space.300" alignBlock="center">
      {children}
    </Inline>
  </Box>
);

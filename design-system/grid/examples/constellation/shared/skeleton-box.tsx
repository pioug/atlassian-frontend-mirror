import React, { type ReactNode } from 'react';

import { Box, xcss } from '@atlaskit/primitives';

const skeletonStyles = xcss({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  borderColor: 'color.border.discovery',
  borderWidth: 'border.width',
  borderStyle: 'solid',
  height: 'size.400',
});

export const SkeletonBox = ({ children }: { children: ReactNode }) => (
  <Box backgroundColor="color.background.discovery" xcss={skeletonStyles}>
    {children}
  </Box>
);

import React, { ReactNode } from 'react';

import { Box, Inline, xcss } from '@atlaskit/primitives';

const iconStyles = xcss({
  borderRadius: 'border.radius',
  flexShrink: 0,
  width: 'size.200',
  height: 'size.200',
});

const IconLink = ({ children }: { children: ReactNode }) => {
  return (
    <Inline space="space.100" alignBlock="center">
      <Box backgroundColor="color.background.neutral" xcss={iconStyles} />
      {children}
    </Inline>
  );
};

export default IconLink;

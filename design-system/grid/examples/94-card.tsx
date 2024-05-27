import React, { type ReactNode } from 'react';

import { Box, xcss } from '@atlaskit/primitives';

const cardStyles = xcss({
  borderColor: 'color.border',
  borderWidth: 'border.width',
  borderRadius: 'border.radius.200',
  borderStyle: 'solid',
});

const Card = ({ children }: { children: ReactNode }) => {
  return (
    <Box xcss={cardStyles} padding="space.300">
      {children}
    </Box>
  );
};

export default Card;

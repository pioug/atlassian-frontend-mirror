import React from 'react';

import { Box, xcss } from '@atlaskit/primitives';
import { media } from '@atlaskit/primitives/responsive';

const cardStyles = xcss({
  borderColor: 'color.border.discovery',
  borderStyle: 'solid',
  borderWidth: 'border.width.0',

  padding: 'space.050',
  // eslint-disable-next-line @repo/internal/styles/no-nested-styles
  [media.above.xs]: {
    padding: 'space.100',
  },
  // eslint-disable-next-line @repo/internal/styles/no-nested-styles
  [media.above.sm]: {
    borderWidth: 'border.width',
    padding: 'space.150',
  },
  // eslint-disable-next-line @repo/internal/styles/no-nested-styles
  [media.above.md]: {
    borderWidth: 'border.width.outline',
    padding: 'space.200',
  },
});

export default () => (
  <Box xcss={cardStyles}>
    Your order details will be available here once completed.
  </Box>
);

import React from 'react';

import { Box, type BoxProps, xcss } from '@atlaskit/primitives';

const blockStyles = xcss({ display: 'flex', borderRadius: 'radius.050' });

const Square = ({
  padding = 'space.200',
}: {
  padding?: BoxProps['padding'];
}) => (
  <Box xcss={blockStyles} padding={padding} backgroundColor="discovery.bold" />
);

export default Square;

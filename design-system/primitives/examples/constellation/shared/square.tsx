import React from 'react';

import { Box, type BoxProps, xcss } from '@atlaskit/primitives';

const blockStyles = xcss({
  display: 'flex',
  borderRadius: 'border.radius.050',
});

const Square = ({
  style = {},
  padding = 'space.200',
}: {
  style?: React.CSSProperties;
  padding?: BoxProps['padding'];
}) => (
  <Box
    style={style}
    xcss={blockStyles}
    padding={padding}
    backgroundColor="color.background.discovery.bold"
  />
);

export default Square;

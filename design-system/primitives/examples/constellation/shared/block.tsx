import React, { ReactNode } from 'react';

import {
  BackgroundColor,
  Box,
  type BoxProps,
  xcss,
} from '@atlaskit/primitives';

const blockStyles = xcss({
  display: 'flex',
  borderRadius: 'border.radius',
  minWidth: '2rem',
  minHeight: '2rem',
  borderStyle: 'solid',
  borderWidth: 'border.width',
  borderColor: 'color.border.discovery',
});

const Block = ({
  style = {},
  padding = 'space.200',
  backgroundColor = 'color.background.discovery',
  children,
}: {
  style?: React.CSSProperties;
  padding?: BoxProps['padding'];
  backgroundColor?: BackgroundColor;
  children?: ReactNode;
}) => (
  <Box
    style={style}
    xcss={blockStyles}
    padding={padding}
    backgroundColor={backgroundColor}
  >
    {children}
  </Box>
);

export default Block;

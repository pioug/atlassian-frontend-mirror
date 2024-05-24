import React, { type ReactNode } from 'react';

import { type BackgroundColor, Box, type Space, xcss } from '@atlaskit/primitives';

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
  padding?: Space;
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

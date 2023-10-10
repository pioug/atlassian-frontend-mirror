import React from 'react';

import { Box, xcss } from '@atlaskit/primitives';

const textStyles = xcss({
  // content can grow and shrink
  flexGrow: 1,
  flexShrink: 1,

  // ellipsis for overflow text
  overflow: 'hidden',
  textOverflow: 'ellipsis',
  whiteSpace: 'nowrap',
});

const iconStyles = xcss({
  display: 'flex',
  // icon size cannot grow and shrink
  flexGrow: 0,
  flexShrink: 0,
  alignSelf: 'center',
  fontSize: 0,
  lineHeight: 0,
  userSelect: 'none',
});

const commonStyles = xcss({
  transition: 'opacity 0.3s',
});

const fadeStyles = xcss({
  opacity: 0,
});

type ContentProps = {
  children: React.ReactNode;
  type?: 'text' | 'icon';
  hasOverlay: boolean;
};

/**
 * __Content__
 *
 * Used for slots within a Button, including icons and text content.
 */
const Content = ({ children, type = 'text', hasOverlay }: ContentProps) => {
  return (
    <Box
      as="span"
      xcss={[
        commonStyles,
        ...(type === 'text' ? [textStyles] : [iconStyles]),
        ...(hasOverlay ? [fadeStyles] : []),
      ]}
    >
      {children}
    </Box>
  );
};

export default Content;

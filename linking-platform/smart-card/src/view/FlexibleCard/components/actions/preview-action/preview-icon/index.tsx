import type { GlyphProps } from '@atlaskit/icon';
import EditorExpandIcon from '@atlaskit/icon/glyph/editor/expand';
import { Box, xcss } from '@atlaskit/primitives';
import React from 'react';

const iconStyles = xcss({
  transform: 'rotate(-45deg)',
});

const PreviewIcon: React.FC<GlyphProps> = (props) => (
  <Box xcss={iconStyles}>
    <EditorExpandIcon {...props} />
  </Box>
);

export default PreviewIcon;

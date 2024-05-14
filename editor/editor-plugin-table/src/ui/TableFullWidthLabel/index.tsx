import React from 'react';

import { useIntl } from 'react-intl-next';

import { tableMessages as messages } from '@atlaskit/editor-common/messages';
import { Box, Inline, xcss } from '@atlaskit/primitives';
import { token } from '@atlaskit/tokens';

const tableFullWidthLabelWrapperStyles = xcss({
  height: token('space.400', '32px'),
  display: 'flex',
  backgroundColor: 'elevation.surface.overlay',
  borderRadius: 'border.radius',
  boxShadow:'elevation.shadow.overlay',
  lineHeight: 1,
  boxSizing: 'border-box',
  alignItems: 'center',
});

const tableFullWidthLabelStyles = xcss({
  marginLeft: 'space.100',
  marginRight: 'space.100',
  paddingLeft: 'space.075',
  paddingRight: 'space.075',
  paddingTop: 'space.050',
  paddingBottom: 'space.050',
});

export const FullWidthDisplay = () => {
  const { formatMessage } = useIntl();
  return (
      <Box xcss={tableFullWidthLabelWrapperStyles}>
        <Inline xcss={tableFullWidthLabelStyles}>{formatMessage(messages.fullWidthLabel)}</Inline>
      </Box>
  );
};

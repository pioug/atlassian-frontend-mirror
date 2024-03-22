import React from 'react';

import { useIntl } from 'react-intl-next';

import { tableMessages as messages } from '@atlaskit/editor-common/messages';
import { Box, Inline, xcss } from '@atlaskit/primitives';
import { token } from '@atlaskit/tokens';

const tableFullWidthLabelStyles = xcss({
  minWidth: '120px',
  height: token('space.300', '24px'),
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
});

export const FullWidthDisplay = () => {
  const { formatMessage } = useIntl();
  return (
    <Box xcss={tableFullWidthLabelStyles}>
      <Inline>{formatMessage(messages.fullWidthLabel)}</Inline>
    </Box>
  );
};

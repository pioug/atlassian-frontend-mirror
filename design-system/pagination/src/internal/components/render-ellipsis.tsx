import React, { ReactElement } from 'react';

import Text from '@atlaskit/ds-explorations/text';
import { Box, xcss } from '@atlaskit/primitives';

const containerStyles = xcss({
  display: 'flex',
  position: 'relative',
});

export type EllipsisProp = {
  key: string;
  testId?: string;
};

export default function renderEllipsis({
  key,
  testId,
}: EllipsisProp): ReactElement {
  return (
    <Box
      as="span"
      testId={testId}
      key={key}
      xcss={containerStyles}
      paddingInline="space.100"
    >
      <Text testId={`${testId}-text`} verticalAlign="middle">
        &hellip;
      </Text>
    </Box>
  );
}

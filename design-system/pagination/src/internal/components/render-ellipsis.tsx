import React, { ReactElement } from 'react';

import Text from '@atlaskit/ds-explorations/text';
import { Box, xcss } from '@atlaskit/primitives';
import VisuallyHidden from '@atlaskit/visually-hidden';

const containerStyles = xcss({
  display: 'flex',
  position: 'relative',
});

export type EllipsisProp = {
  key: string;
  testId?: string;
  from: number;
  to: number;
};

export default function renderEllipsis({
  key,
  testId,
  from,
  to,
}: EllipsisProp): ReactElement {
  return (
    <Box
      as="li"
      testId={testId}
      key={key}
      xcss={containerStyles}
      paddingInline="space.100"
    >
      <Text testId={`${testId}-text`} verticalAlign="middle">
        <VisuallyHidden>
          Skipped pages from {from} to {to}
        </VisuallyHidden>
        &hellip;
      </Text>
    </Box>
  );
}

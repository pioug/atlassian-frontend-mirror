import React, { ReactElement } from 'react';

import Box from '@atlaskit/ds-explorations/box';
import Text from '@atlaskit/ds-explorations/text';

export type EllipsisProp = {
  key: string;
  testId?: string;
};

export default function renderEllipsis({
  key,
  testId,
}: EllipsisProp): ReactElement {
  return (
    <Box as="span" testId={testId} key={key} paddingInline="space.100">
      <Text testId={`${testId}-text`} verticalAlign="middle">
        &hellip;
      </Text>
    </Box>
  );
}

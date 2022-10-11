import React from 'react';

import {
  UNSAFE_Box as Box,
  UNSAFE_Stack as Stack,
  UNSAFE_Text as Text,
} from '@atlaskit/ds-explorations';
import WarningIcon from '@atlaskit/icon/glyph/warning';

import Banner from '../src';

const Padded = ({ children }: { children: React.ReactNode }) => (
  <Box display="block" paddingInline="sp-200">
    <Text>{children}</Text>
  </Box>
);

export default () => (
  <Stack gap="sp-200" UNSAFE_style={{ width: 400 }}>
    <Banner icon={<WarningIcon label="" secondaryColor="inherit" />}>
      JIRA Service Desk pricing has been updated. Please migrate within 3
      months.
    </Banner>
    <Padded>
      There should only be 1 line of text, with ellipsis (…) shown when text
      overflows.
    </Padded>
  </Stack>
);

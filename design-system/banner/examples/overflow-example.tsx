import React from 'react';

import { UNSAFE_Text as Text } from '@atlaskit/ds-explorations';
import Box from '@atlaskit/ds-explorations/box';
import WarningIcon from '@atlaskit/icon/glyph/warning';
import Stack from '@atlaskit/primitives/stack';

import Banner from '../src';

const Padded = ({ children }: { children: React.ReactNode }) => (
  <Box paddingInline="space.200">
    <Text>{children}</Text>
  </Box>
);

export default () => (
  <Box as="span" UNSAFE_style={{ width: 400 }}>
    <Stack space="space.200">
      <Banner icon={<WarningIcon label="" secondaryColor="inherit" />}>
        JIRA Service Desk pricing has been updated. Please migrate within 3
        months.
      </Banner>
      <Padded>
        There should only be 1 line of text, with ellipsis (…) shown when text
        overflows.
      </Padded>
    </Stack>
  </Box>
);

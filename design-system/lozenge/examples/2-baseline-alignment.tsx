import React from 'react';

import {
  UNSAFE_Box as Box,
  UNSAFE_Text as Text,
} from '@atlaskit/ds-explorations';
import Stack from '@atlaskit/primitives/stack';

import Lozenge from '../src';

export default () => (
  <Stack space="space.200" testId="test-container">
    <Box display="block">
      <Text UNSAFE_style={{ fontSize: '30px' }}>Heading</Text>
      <Text> </Text>
      <Lozenge
        isBold
        appearance="new"
        testId="lozenge-baseline-alignment-heading"
      >
        lozenge
      </Lozenge>
    </Box>
    <Box display="block">
      <Text fontSize="size.050">11px Text</Text>
      <Text> </Text>
      <Lozenge isBold appearance="new" testId="lozenge-baseline-alignment-11px">
        lozenge
      </Lozenge>
    </Box>
    <Box display="block">
      <Text fontSize="size.075">12px Text</Text>
      <Text> </Text>
      <Lozenge isBold appearance="new" testId="lozenge-baseline-alignment-12px">
        lozenge
      </Lozenge>
    </Box>
    <Box display="block">
      <Text fontSize="size.100">14px Text</Text>
      <Text> </Text>
      <Lozenge isBold appearance="new" testId="lozenge-baseline-alignment-14px">
        lozenge
      </Lozenge>
    </Box>
  </Stack>
);

import React from 'react';

import Heading from '@atlaskit/heading';

import { Box, Inline, Stack } from '../src';

export default () => {
  return (
    <Stack space="400" alignInline="start">
      <Stack space="200" testId="box-with-flex">
        <Heading level="h600">flex</Heading>
        <Inline space="200" alignBlock="center">
          <Box display="flex" padding="space.400">
            <Box borderStyle="solid" flex="1">
              flex=1
            </Box>
            <Box borderStyle="solid" flex="1">
              flex=1
            </Box>
          </Box>
        </Inline>
      </Stack>

      <Stack space="200" testId="box-with-flex">
        <Heading level="h600">flexGrow</Heading>
        <Inline space="200" alignBlock="center">
          <Box display="flex" padding="space.400" style={{ width: '300px' }}>
            <Box borderStyle="solid" flexGrow="0">
              flexGrow=0
            </Box>
            <Box borderStyle="solid" flexGrow="1">
              flexGrow=1
            </Box>
          </Box>
        </Inline>
      </Stack>
    </Stack>
  );
};

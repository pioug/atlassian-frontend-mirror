import React from 'react';

import { Box, Flex } from '../src';

const Square = () => (
  <Box backgroundColor="color.background.neutral" padding="space.600" />
);

export default function Basic() {
  return (
    <Flex testId="flex-basic" wrap="wrap" gap="space.200">
      <Square />
      <Square />
      <Square />
      <Square />
      <Square />
      <Square />
    </Flex>
  );
}

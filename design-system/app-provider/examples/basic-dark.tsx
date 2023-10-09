import React from 'react';

import { Box } from '@atlaskit/primitives';

import AppProvider, { useColorMode } from '../src';

function Basic() {
  const colorMode = useColorMode();

  return <Box padding="space.200">Color mode: {colorMode}</Box>;
}

export default function () {
  return (
    <AppProvider defaultColorMode="dark">
      <Basic />
    </AppProvider>
  );
}

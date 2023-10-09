import React from 'react';

import { Box } from '@atlaskit/primitives';

import AppProvider from '../../src';

function ThemedComponent() {
  return (
    <Box backgroundColor="elevation.surface" padding="space.200">
      <Box as="h3" paddingBlockEnd="space.200">
        Theming with design tokens
      </Box>
    </Box>
  );
}

export default function AppProviderTheme() {
  return (
    <AppProvider>
      <ThemedComponent />
    </AppProvider>
  );
}

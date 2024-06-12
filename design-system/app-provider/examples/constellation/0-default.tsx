import React from 'react';

import { Box } from '@atlaskit/primitives';

const AppProviderThemeCodeBlock = `import React from 'react';
import { Box } from '@atlaskit/primitives';
import AppProvider from '@atlaskit/app-provider';

function ThemedComponent() {
  return (
    <Box backgroundColor="elevation.surface" padding="space.200">
      <Box as="h3">
        Theming with design tokens
      </Box>
    </Box>
  );
}

function AppProviderTheme() {
  return (
    <AppProvider>
      <ThemedComponent />
    </AppProvider>
  );
}`;

function ThemedComponent() {
	return (
		<Box backgroundColor="elevation.surface" padding="space.200">
			<Box as="h3">Theming with design tokens</Box>
		</Box>
	);
}

function AppProviderTheme() {
	return <ThemedComponent />;
}

export default { example: AppProviderTheme, code: AppProviderThemeCodeBlock };

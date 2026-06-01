import React from 'react';

import { Box } from '@atlaskit/primitives/compiled';

const AppProviderThemeCodeBlock = `import React from 'react';
import { Box } from '@atlaskit/primitives/compiled';
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

function AppProviderTheme(): React.JSX.Element {
	return <ThemedComponent />;
}

const _default_1: {
	example: typeof AppProviderTheme;
	code: string;
} = { example: AppProviderTheme, code: AppProviderThemeCodeBlock };
export default _default_1;

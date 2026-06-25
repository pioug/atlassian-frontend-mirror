import React, { useEffect } from 'react';

import { ThemeProvider, useColorMode, useSetColorMode } from '@atlaskit/app-provider';
import Button from '@atlaskit/button/new';
import { Box, Inline, Stack, Text } from '@atlaskit/primitives/compiled';
import type { ThemeColorModes } from '@atlaskit/tokens';

const code = `import React, { useEffect } from 'react';
import AppProvider, { ThemeProvider, useColorMode, useSetColorMode } from '@atlaskit/app-provider';
import Button from '@atlaskit/button/new';
import { Box, Inline, Stack, Text } from '@atlaskit/primitives/compiled';
import type { ThemeColorModes } from '@atlaskit/tokens';

function InvertedPanelContent({ parentColorMode }: { parentColorMode: ThemeColorModes }) {
  const setColorMode = useSetColorMode();

  useEffect(() => {
    // Always apply the opposite of the parent color mode
    setColorMode(parentColorMode === 'light' ? 'dark' : 'light');
  }, [parentColorMode, setColorMode]);

  return (
    <Box backgroundColor="elevation.surface" padding="space.300">
      <Stack space="space.200">
        <Text as="p">
          This panel is always the opposite color mode to its parent.
          It reacts to changes in the parent's color mode automatically.
        </Text>
        <Inline space="space.100">
          <Button>Inverted button</Button>
        </Inline>
      </Stack>
    </Box>
  );
}

function InvertedPanel() {
  // Read the color mode from the nearest parent ThemeProvider (or AppProvider)
  const parentColorMode = useColorMode();

  return (
    <ThemeProvider>
      <InvertedPanelContent parentColorMode={parentColorMode} />
    </ThemeProvider>
  );
}

function DynamicSubTreeThemingExample() {
  return (
    <AppProvider defaultColorMode="light">
      <Box backgroundColor="elevation.surface" padding="space.300">
        <Stack space="space.200">
          <Text as="p">Parent panel.</Text>
          <InvertedPanel />
        </Stack>
      </Box>
    </AppProvider>
  );
}`;

function InvertedPanelContent({ parentColorMode }: { parentColorMode: ThemeColorModes }) {
	const setColorMode = useSetColorMode();

	useEffect(() => {
		setColorMode(parentColorMode === 'light' ? 'dark' : 'light');
	}, [parentColorMode, setColorMode]);

	return (
		<Box backgroundColor="elevation.surface" padding="space.300">
			<Stack space="space.200">
				<Text as="p">
					This panel is always the opposite color mode to its parent. It reacts to changes in the
					parent's color mode automatically.
				</Text>
				<Inline space="space.100">
					<Button>Inverted button</Button>
				</Inline>
			</Stack>
		</Box>
	);
}

function InvertedPanel() {
	const parentColorMode = useColorMode();

	return (
		<ThemeProvider>
			<InvertedPanelContent parentColorMode={parentColorMode} />
		</ThemeProvider>
	);
}

function DynamicSubTreeThemingExampleComponent(): React.JSX.Element {
	return (
		<Box backgroundColor="elevation.surface" padding="space.300">
			<Stack space="space.200">
				<Text as="p">Parent panel.</Text>
				<InvertedPanel />
			</Stack>
		</Box>
	);
}

const _default: {
	example: typeof DynamicSubTreeThemingExampleComponent;
	code: string;
} = { example: DynamicSubTreeThemingExampleComponent, code };
export default _default;

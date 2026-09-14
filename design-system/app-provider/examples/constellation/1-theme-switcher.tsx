import React from 'react';

import { useColorMode } from '@atlaskit/app-provider/use-color-mode';
import { useSetColorMode } from '@atlaskit/app-provider/use-set-color-mode';
import { useSetTheme } from '@atlaskit/app-provider/use-set-theme';
import { useTheme } from '@atlaskit/app-provider/use-theme';
import DropdownMenu from '@atlaskit/dropdown-menu/dropdown-menu';
import DropdownItem from '@atlaskit/dropdown-menu/dropdown-menu-item';
import DropdownItemGroup from '@atlaskit/dropdown-menu/dropdown-menu-item-group';
import { Box } from '@atlaskit/primitives/compiled';

const AppProviderThemeCodeBlock = `import React from 'react';
import { Box } from '@atlaskit/primitives/compiled';
import AppProvider from '@atlaskit/app-provider';

function ColorModeSwitcher() {
  const colorMode = useColorMode();
  const setColorMode = useSetColorMode();

  return (
    <Box backgroundColor="elevation.surface" padding="space.200">
      <Box as="h3" paddingBlockEnd="space.200">
        Current color mode: {colorMode}
      </Box>
      <DropdownMenu trigger="Change color mode">
        <DropdownItemGroup>
          <DropdownItem onClick={() => setColorMode('light')}>
            Light
          </DropdownItem>
          <DropdownItem onClick={() => setColorMode('dark')}>Dark</DropdownItem>
          <DropdownItem onClick={() => setColorMode('auto')}>Auto</DropdownItem>
        </DropdownItemGroup>
      </DropdownMenu>
    </Box>
  );
}

function ThemeSwitcher() {
  const theme = useTheme();
  const setTheme = useSetTheme();

  return (
    <Box backgroundColor="elevation.surface" padding="space.200">
      <Box as="h3" paddingBlockEnd="space.200">
        Current light theme: {theme.light}
      </Box>
      <DropdownMenu trigger="Change light theme">
        <DropdownItemGroup>
          <DropdownItem onClick={() => setTheme({ light: 'light' })}>
            Light theme
          </DropdownItem>
        </DropdownItemGroup>
      </DropdownMenu>
    </Box>
  );
}

function AppProviderTheme() {
  return (
    <AppProvider defaultColorMode="auto">
      <ColorModeSwitcher />
      <ThemeSwitcher />
    </AppProvider>
  );
}`;

function ColorModeSwitcher() {
	const colorMode = useColorMode();
	const setColorMode = useSetColorMode();

	return (
		<Box backgroundColor="elevation.surface" padding="space.200">
			<Box as="h3" paddingBlockEnd="space.200">
				Current color mode: {colorMode}
			</Box>
			<DropdownMenu shouldRenderToParent trigger="Change color mode">
				<DropdownItemGroup>
					<DropdownItem onClick={() => setColorMode('light')}>Light</DropdownItem>
					<DropdownItem onClick={() => setColorMode('dark')}>Dark</DropdownItem>
					<DropdownItem onClick={() => setColorMode('auto')}>Auto</DropdownItem>
				</DropdownItemGroup>
			</DropdownMenu>
		</Box>
	);
}

function ThemeSwitcher() {
	const theme = useTheme();
	const setTheme = useSetTheme();

	return (
		<Box backgroundColor="elevation.surface" padding="space.200">
			<Box as="h3" paddingBlockEnd="space.200">
				Current light theme: {theme.light}
			</Box>
			<DropdownMenu shouldRenderToParent trigger="Change light theme">
				<DropdownItemGroup>
					<DropdownItem onClick={() => setTheme({ light: 'light' })}>Light theme</DropdownItem>
				</DropdownItemGroup>
			</DropdownMenu>
		</Box>
	);
}

function AppProviderTheme(): React.JSX.Element {
	return (
		<>
			<ColorModeSwitcher />
			<ThemeSwitcher />
		</>
	);
}

const _default_1: {
	example: typeof AppProviderTheme;
	code: string;
} = { example: AppProviderTheme, code: AppProviderThemeCodeBlock };
export default _default_1;

import React from 'react';

import { useColorMode, useSetColorMode, useSetTheme, useTheme } from '@atlaskit/app-provider';
import DropdownMenu, { DropdownItem, DropdownItemGroup } from '@atlaskit/dropdown-menu';
// eslint-disable-next-line @atlaskit/design-system/no-emotion-primitives -- to be migrated to @atlaskit/primitives/compiled – go/akcss
import { Box } from '@atlaskit/primitives';

const AppProviderThemeCodeBlock = `import React from 'react';
// eslint-disable-next-line @atlaskit/design-system/no-emotion-primitives -- to be migrated to @atlaskit/primitives/compiled – go/akcss
import { Box } from '@atlaskit/primitives';
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
          <DropdownItem onClick={() => setTheme({ light: 'legacy-light' })}>
            Legacy light theme
          </DropdownItem>
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
					<DropdownItem onClick={() => setTheme({ light: 'legacy-light' })}>
						Legacy light theme
					</DropdownItem>
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

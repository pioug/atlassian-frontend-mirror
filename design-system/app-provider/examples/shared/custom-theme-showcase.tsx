/**
 * @jsxRuntime classic
 * @jsx jsx
 */
import React, { useEffect } from 'react';

import { AppProvider } from '@atlaskit/app-provider/app-provider';
import { useSetColorMode } from '@atlaskit/app-provider/use-set-color-mode';
import { cssMap, jsx } from '@atlaskit/css';
import Heading from '@atlaskit/heading/heading';
import { Main } from '@atlaskit/navigation-system/layout/main';
import { Panel } from '@atlaskit/navigation-system/layout/panel';
import { PanelSplitter } from '@atlaskit/navigation-system/layout/panel-splitter';
import { Root } from '@atlaskit/navigation-system/layout/root';
import { Stack } from '@atlaskit/primitives/compiled/stack';
import { token } from '@atlaskit/tokens';
import useThemeObserver from '@atlaskit/tokens/use-theme-observer';

const panelStyles = cssMap({
	root: {
		backgroundColor: token('elevation.surface.sunken'),
	},
	content: {
		paddingBlock: token('space.300'),
		paddingInline: token('space.300'),
	},
});

const mainStyles = cssMap({
	content: {
		paddingBlock: token('space.400'),
		paddingInline: token('space.400'),
	},
});

type ColorMode = Parameters<ReturnType<typeof useSetColorMode>>[0];

/**
 * Keeps the enclosing provider's colour mode in step with `colorMode`.
 *
 * A provider only reads `defaultColorMode` when it mounts, so passing a new value later has no
 * effect. Render this inside the provider to follow a mode that changes after mount, such as the
 * Workbench colour mode or a parent provider's mode.
 */
export function SyncColorMode({ colorMode }: { colorMode: ColorMode | undefined }): null {
	const setColorMode = useSetColorMode();

	useEffect(() => {
		if (colorMode) {
			setColorMode(colorMode);
		}
	}, [colorMode, setColorMode]);

	return null;
}

export function CustomThemeShowcase({
	children,
	controls,
	panelTitle = 'Dynamic theme variables',
	panelWidth,
	topNavigation,
}: {
	children: React.ReactNode;
	/**
	 * Form controls rendered in the side panel, below its heading.
	 */
	controls?: React.ReactNode;
	panelTitle?: string;
	/**
	 * Initial width of the side panel, in pixels.
	 */
	panelWidth?: number;
	topNavigation?: React.ReactNode;
}): React.JSX.Element {
	const { colorMode } = useThemeObserver();

	return (
		<AppProvider
			defaultColorMode={colorMode}
			defaultTheme={{
				light: {
					id: 'UNSAFE-dynamic',
					overrides: {
						dynamicForeground: '#000',
						dynamicBackground: '#fff',
					},
				},
				dark: {
					id: 'UNSAFE-dynamic-dark',
					overrides: {
						dynamicForeground: '#fff',
						dynamicBackground: '#000',
					},
				},
			}}
		>
			{/* Follow the Workbench colour mode after mount. */}
			<SyncColorMode colorMode={colorMode} />
			<Root>
				{topNavigation}
				<Main>
					<Stack space="space.300" xcss={mainStyles.content}>
						{children}
					</Stack>
				</Main>
				<Panel xcss={panelStyles.root} defaultWidth={panelWidth} label={panelTitle}>
					<Stack space="space.200" xcss={panelStyles.content}>
						<Heading as="h2" size="small">
							{panelTitle}
						</Heading>
						{controls}
					</Stack>
					<PanelSplitter label="Resize dynamic theme controls" />
				</Panel>
			</Root>
		</AppProvider>
	);
}

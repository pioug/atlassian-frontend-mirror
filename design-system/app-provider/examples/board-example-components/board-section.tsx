/**
 * @jsxRuntime classic
 * @jsx jsx
 */

import { Fragment, type JSX, useEffect } from 'react';

import { jsx } from '@compiled/react';

import { ThemeProvider } from '@atlaskit/app-provider/theme-provider';
import { useColorMode } from '@atlaskit/app-provider/use-color-mode';
import { useSetColorMode } from '@atlaskit/app-provider/use-set-color-mode';
import { useSetTheme } from '@atlaskit/app-provider/use-set-theme';
import { cssMap } from '@atlaskit/css';
import { Box } from '@atlaskit/primitives/compiled/box';
import { token } from '@atlaskit/tokens';

import { BoardColumn } from './board-column';
import { BoardHeader } from './board-header';
import { BoardSubMenu } from './board-sub-menu';
import { BoardTabs } from './board-tabs';
import { DEFAULT_BOARD_COLUMNS } from './constants';
import type { BoardConfig } from './types';
import { calculateAccessibleForegroundColor } from './utils/color-utils';

const boardStyles = cssMap({
	root: {
		width: '100%',
		height: '100%',
		flexDirection: 'column',
		position: 'relative',
	},
	board: {
		width: '100%',
		flex: 1,
		paddingInline: token('space.200'),
		paddingBlock: token('space.0'),
		overflow: 'hidden',
		display: 'flex',
		alignItems: 'stretch',
		gap: token('space.100'),
		position: 'relative',
		zIndex: 1,
		minHeight: '100%',
	},
});

export interface BoardSectionProps {
	config: BoardConfig;
	shouldEnableCustomization?: boolean;
	columnsContent?: React.ReactNode;
}

// Component to update theme state when props change (without remounting)
const ThemeUpdater = ({
	backgroundColor,
	disableDynamicTheming,
}: {
	backgroundColor: string;
	disableDynamicTheming: boolean;
}) => {
	const setColorMode = useSetColorMode();
	const setTheme = useSetTheme();

	// Calculate color mode based on background color
	useEffect(() => {
		if (disableDynamicTheming && backgroundColor) {
			const idealForeground = calculateAccessibleForegroundColor(backgroundColor);
			const calculatedColorMode = idealForeground === '#ffffff' ? 'dark' : 'light';
			setColorMode(calculatedColorMode);
		}
	}, [backgroundColor, disableDynamicTheming, setColorMode]);

	// Update theme based on whether dynamic theming is disabled
	useEffect(() => {
		setTheme({
			light: 'light',
			dark: 'dark',
			shape: 'shape',
			spacing: 'spacing',
			typography: 'typography',
		});
	}, [disableDynamicTheming, setTheme]);

	return null;
};

export const BoardSection = ({
	config,
	shouldEnableCustomization: enableCustomization = true,
	columnsContent,
}: BoardSectionProps): JSX.Element => {
	const appColorMode = useColorMode();

	// Only apply dynamic theming when customization is enabled AND backgroundColor is set AND not disabled
	const hasBackgroundColor = Boolean(config.backgroundColor && config.backgroundColor.trim());
	const isDynamicThemingDisabled = config.disableDynamicTheming === true;
	const shouldApplyTheming = enableCustomization && hasBackgroundColor && !isDynamicThemingDisabled;

	// When dynamic theming is disabled but background color is set, determine light/dark theme
	// based on ideal foreground color (same cutoff as dynamic theming)
	const shouldHardcodeBackground =
		enableCustomization && hasBackgroundColor && isDynamicThemingDisabled;

	// Only calculate theme color mode when needed (when hardcoding background)
	let themeColorMode: 'light' | 'dark' | 'auto' = appColorMode;
	if (shouldHardcodeBackground) {
		const idealForeground = calculateAccessibleForegroundColor(config.backgroundColor);
		themeColorMode = idealForeground === '#ffffff' ? 'dark' : 'light';
	}

	// Ensure dynamic theming is only applied when explicitly enabled
	const headerContent =
		shouldApplyTheming && !isDynamicThemingDisabled ? (
			<ThemeProvider
				defaultColorMode="light"
				defaultTheme={{
					light: {
						id: 'UNSAFE-dynamic',
						overrides: {
							dynamicBackground: config.backgroundColor,
							dynamicForeground: config.foregroundColor,
						},
					},
				}}
			>
				<BoardHeader />
				<BoardTabs />
				<BoardSubMenu />
			</ThemeProvider>
		) : shouldHardcodeBackground ? (
			<ThemeProvider
				defaultColorMode={themeColorMode}
				defaultTheme={{
					light: 'light',
					dark: 'dark',
					shape: 'shape',
					spacing: 'spacing',
					typography: 'typography',
				}}
			>
				<ThemeUpdater
					backgroundColor={config.backgroundColor}
					disableDynamicTheming={isDynamicThemingDisabled}
				/>
				<BoardHeader />
				<BoardTabs />
				<BoardSubMenu />
			</ThemeProvider>
		) : (
			<Fragment>
				<BoardHeader />
				<BoardTabs />
				<BoardSubMenu />
			</Fragment>
		);

	return (
		<Box
			xcss={boardStyles.root}
			// eslint-disable-next-line @atlaskit/ui-styling-standard/enforce-style-prop
			style={
				shouldApplyTheming
					? {
							color: config.foregroundColor,
							backgroundColor: config.backgroundColor,
						}
					: shouldHardcodeBackground
						? {
								backgroundColor: config.backgroundColor,
							}
						: undefined
			}
		>
			{headerContent}
			<Box
				xcss={boardStyles.board}
				// eslint-disable-next-line @atlaskit/ui-styling-standard/enforce-style-prop
				style={
					enableCustomization
						? {
								backgroundImage:
									config.showImage && hasBackgroundColor
										? `linear-gradient(to bottom, ${config.backgroundColor}, ${config.backgroundColor} 20%, transparent 40%), url(${config.bannerImageUrl})`
										: undefined,
								backgroundColor: config.showImage
									? 'transparent'
									: config.backgroundColor || undefined,
								backgroundSize: config.showImage ? 'cover' : undefined,
								backgroundPosition: config.showImage ? 'center center' : undefined,
								backgroundRepeat: config.showImage ? 'no-repeat' : undefined,
								backgroundAttachment: config.showImage ? 'fixed' : undefined,
							}
						: undefined
				}
			>
				{columnsContent ||
					DEFAULT_BOARD_COLUMNS.map((column) => (
						<BoardColumn
							key={column.title}
							column={column}
							shouldEnableGradient={enableCustomization && hasBackgroundColor}
						/>
					))}
			</Box>
		</Box>
	);
};

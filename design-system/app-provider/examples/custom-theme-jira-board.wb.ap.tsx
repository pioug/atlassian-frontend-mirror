/**
 * @jsxRuntime classic
 * @jsx jsx
 */
import { Fragment, type JSX, type ReactNode, useEffect, useRef, useState } from 'react';

import { ThemeProvider } from '@atlaskit/app-provider/theme-provider';
import { useColorMode } from '@atlaskit/app-provider/use-color-mode';
import { useSetColorMode } from '@atlaskit/app-provider/use-set-color-mode';
import { cssMap, jsx } from '@atlaskit/css';
import { Main } from '@atlaskit/navigation-system/layout/main';
import { Panel } from '@atlaskit/navigation-system/layout/panel';
import { PanelSplitter } from '@atlaskit/navigation-system/layout/panel-splitter';
import { Root } from '@atlaskit/navigation-system/layout/root';
import { SideNav } from '@atlaskit/navigation-system/layout/side-nav';
import { TopNav } from '@atlaskit/navigation-system/layout/top-nav';
import { Box } from '@atlaskit/primitives/compiled/box';
import { token } from '@atlaskit/tokens';

import darkSkyUrl from './assets/dark-sky.jpg';
import vitafleetUrl from './assets/logos/vitafleet.png';
import {
	type AdvancedParameters,
	type BoardConfig,
	BoardSection,
	calculateAccessibleForegroundColor,
	type NavThemingMode,
	setColorLightnessByHct,
	SideNavContentComponent,
	type ThemeColorModes,
	type ThemeConfig,
	ThemeControlsPanel,
	type TintingConfig,
	TopNavContent,
	useNavTheming,
} from './board-example-components';

const WithResponsiveViewport = ({ children }: { children: ReactNode }) => (
	<Fragment>
		<meta name="viewport" content="width=device-width, initial-scale=1.0" />
		{children}
	</Fragment>
);

const pageLayoutWrapperStyles = cssMap({
	wrapper: {
		display: 'flex',
		height: '100vh',
		width: '100%',
	},
	rootContainer: {
		flexGrow: 1,
		flexShrink: '1',
		flexBasis: '0%',
		minWidth: '0px',
		display: 'flex',
		flexDirection: 'column',
	},
});

const mainContentWrapperStyles = cssMap({
	wrapper: {
		width: '100%',
		height: '100%',
		position: 'relative',
		borderStartStartRadius: token('radius.large'),
		overflow: 'hidden',
		backgroundColor: token('elevation.surface'),
	},
	mainBackground: {
		width: '100%',
		height: '100%',
		position: 'relative',
	},
	navBackgroundCorner: {
		position: 'absolute',
		insetBlockStart: token('space.0'),
		insetInlineStart: token('space.0'),
		// @ts-expect-error - token values are valid for width/height
		width: token('radius.large'),
		// @ts-expect-error - token values are valid for width/height
		height: token('radius.large'),
		pointerEvents: 'none',
	},
});

/**
 * Themes nav content with the dynamic theme. The nav surfaces are painted by `useNavTheming`.
 */
function NavThemeScope({
	isEnabled,
	backgroundColor,
	foregroundColor,
	children,
}: {
	isEnabled: boolean;
	backgroundColor: string;
	foregroundColor: string;
	children: ReactNode;
}): JSX.Element {
	if (!isEnabled) {
		return <Fragment>{children}</Fragment>;
	}

	return (
		<ThemeProvider
			defaultColorMode="light"
			defaultTheme={{
				light: {
					id: 'UNSAFE-dynamic',
					overrides: {
						dynamicBackground: backgroundColor,
						dynamicForeground: foregroundColor,
					},
				},
			}}
		>
			{children}
		</ThemeProvider>
	);
}

/**
 * Board-themed example demonstrating ThemeProvider custom theming for navigation and content areas.
 */
export default function BoardThemedExample({
	defaultPanelWidth = 440,
}: {
	defaultPanelWidth?: number;
}): JSX.Element {
	return (
		<ThemeProvider
			defaultColorMode="auto"
			defaultTheme={{ light: 'light', dark: 'dark', typography: 'typography' }}
		>
			<BoardThemedExampleContent defaultPanelWidth={defaultPanelWidth} />
		</ThemeProvider>
	);
}

function BoardThemedExampleContent({ defaultPanelWidth }: { defaultPanelWidth: number }) {
	const [topNavTheme, setTopNavTheme] = useState<ThemeConfig>({
		backgroundColor: '#C03E35',
		foregroundColor: '#ffffff',
		autoForegroundColor: true,
		logoUrl: vitafleetUrl,
	});

	const [boardConfig, setBoardConfig] = useState<BoardConfig>({
		backgroundColor: '#293947',
		foregroundColor: '#ffffff',
		autoForegroundColor: true,
		showImage: true,
		bannerImageUrl: darkSkyUrl,
	});

	const [enableNavCustomization, setEnableNavCustomization] = useState(true);
	const [enableBoardCustomization, setEnableBoardCustomization] = useState(true);
	const [isPanelCollapsed, setIsPanelCollapsed] = useState(false);
	const [advancedParameters, setAdvancedParameters] = useState<AdvancedParameters>({
		autoForegroundColor: true,
		subtleLightness: 85, // Default HCT tone for subtle backgrounds
		tintNeutrals: false,
		tintSurface: false,
		tintNavBackground: true, // Navigation background tinting is on by default
		themeWholeNav: true,
	});
	const [tintingConfig, setTintingConfig] = useState<TintingConfig>({
		enabled: false,
		brandColor: '#C03E35',
		autoBrandColor: false,
	});
	const [navThemingMode, setNavThemingMode] = useState<NavThemingMode>('subtle');
	const [appColorMode, setAppColorMode] = useState<ThemeColorModes>('auto');
	const prevNavThemingModeRef = useRef<NavThemingMode>(navThemingMode);

	// Get resolved color mode for use in effects
	const resolvedColorMode = useColorMode();
	const isDarkMode = resolvedColorMode === 'dark';
	const setColorMode = useSetColorMode();

	// `defaultColorMode` is only read on mount, so push color mode changes to the provider
	useEffect(() => {
		setColorMode(appColorMode);
	}, [appColorMode, setColorMode]);

	// Sync background color with brand color for bold mode
	useEffect(() => {
		if (enableNavCustomization && navThemingMode === 'bold') {
			setTopNavTheme((prev) => ({
				...prev,
				backgroundColor: tintingConfig.brandColor,
			}));
		}
	}, [tintingConfig.brandColor, enableNavCustomization, navThemingMode]);

	// Automatically enable monochrome logo when switching to bold (colourful) mode and whole nav is themed
	useEffect(() => {
		// Only auto-enable when transitioning TO bold mode with whole nav themed, not when already in bold mode
		if (
			enableNavCustomization &&
			navThemingMode === 'bold' &&
			advancedParameters.themeWholeNav &&
			prevNavThemingModeRef.current !== 'bold'
		) {
			setTopNavTheme((prev) => ({
				...prev,
				logoMonochrome: true,
			}));
		}
		prevNavThemingModeRef.current = navThemingMode;
	}, [enableNavCustomization, navThemingMode, advancedParameters.themeWholeNav]);

	// Auto-update foreground color when background changes and auto-foreground is enabled
	useEffect(() => {
		if (
			topNavTheme.autoForegroundColor !== false &&
			enableNavCustomization &&
			navThemingMode === 'bold'
		) {
			const accessibleColor = calculateAccessibleForegroundColor(tintingConfig.brandColor);
			setTopNavTheme((prev) => ({ ...prev, foregroundColor: accessibleColor }));
		}
	}, [
		tintingConfig.brandColor,
		topNavTheme.autoForegroundColor,
		enableNavCustomization,
		navThemingMode,
	]);

	// Auto-update board foreground color when background changes and auto-foreground is enabled
	useEffect(() => {
		const hasBackgroundColor = Boolean(
			boardConfig.backgroundColor && boardConfig.backgroundColor.trim(),
		);
		if (
			boardConfig.autoForegroundColor !== false &&
			enableBoardCustomization &&
			hasBackgroundColor &&
			boardConfig.disableDynamicTheming !== true
		) {
			const accessibleColor = calculateAccessibleForegroundColor(boardConfig.backgroundColor);
			setBoardConfig((prev) => ({ ...prev, foregroundColor: accessibleColor }));
		}
	}, [
		boardConfig.backgroundColor,
		boardConfig.autoForegroundColor,
		boardConfig.disableDynamicTheming,
		enableBoardCustomization,
	]);

	// Nav theming is handled by the useNavTheming hook, which applies it only to nav elements
	useNavTheming({
		enableNavCustomization,
		navThemingMode,
		tintingConfig,
		advancedParameters,
		resolvedColorMode,
	});

	const isWholeNavBold = Boolean(
		enableNavCustomization && advancedParameters.themeWholeNav && navThemingMode === 'bold',
	);

	const navBackgroundColor = isWholeNavBold
		? tintingConfig.brandColor
		: enableNavCustomization && advancedParameters.themeWholeNav && navThemingMode === 'subtle'
			? setColorLightnessByHct(
					tintingConfig.brandColor,
					advancedParameters.subtleLightness,
					isDarkMode,
				)
			: token('elevation.surface');

	return (
		<Fragment>
			{(enableNavCustomization || enableBoardCustomization) && (
				// eslint-disable-next-line @atlaskit/ui-styling-standard/no-global-styles
				<style>
					{`
						* {
							transition: background-color 0.3s ease, color 0.3s ease, border-color 0.3s ease, fill 0.3s ease, stroke 0.3s ease !important;
						}
						*::before,
						*::after {
							transition: background-color 0.3s ease, color 0.3s ease, border-color 0.3s ease, fill 0.3s ease, stroke 0.3s ease !important;
						}
					`}
				</style>
			)}
			<WithResponsiveViewport>
				<div css={pageLayoutWrapperStyles.wrapper}>
					<div css={pageLayoutWrapperStyles.rootContainer}>
						<Root testId="root">
							<TopNav>
								<NavThemeScope
									isEnabled={isWholeNavBold}
									backgroundColor={tintingConfig.brandColor}
									foregroundColor={topNavTheme.foregroundColor}
								>
									<TopNavContent
										topNavTheme={topNavTheme}
										shouldEnableNavCustomization={enableNavCustomization}
										navThemingMode={navThemingMode}
										appColorMode={appColorMode}
										onAppColorModeChange={setAppColorMode}
										isPanelCollapsed={isPanelCollapsed}
										onPanelToggle={() => setIsPanelCollapsed((prev) => !prev)}
									/>
								</NavThemeScope>
							</TopNav>
							<SideNav>
								<NavThemeScope
									isEnabled={isWholeNavBold}
									backgroundColor={tintingConfig.brandColor}
									foregroundColor={topNavTheme.foregroundColor}
								>
									<SideNavContentComponent />
								</NavThemeScope>
								<PanelSplitter label="Resize side nav" testId="side-nav-panel-splitter" />
							</SideNav>
							<Main id="main-container">
								<Box xcss={mainContentWrapperStyles.mainBackground}>
									<Box
										xcss={mainContentWrapperStyles.navBackgroundCorner}
										style={{
											backgroundColor: navBackgroundColor,
										}}
									/>
									<Box xcss={mainContentWrapperStyles.wrapper}>
										{enableBoardCustomization ? (
											<BoardSection config={boardConfig} shouldEnableCustomization={true} />
										) : (
											<BoardSection
												config={{
													backgroundColor: '#ffffff',
													foregroundColor: '#000000',
													autoForegroundColor: false,
													showImage: false,
													bannerImageUrl: '',
												}}
												shouldEnableCustomization={false}
											/>
										)}
									</Box>
								</Box>
							</Main>
							<Panel defaultWidth={isPanelCollapsed ? 0 : defaultPanelWidth}>
								<ThemeControlsPanel
									topNavTheme={topNavTheme}
									boardConfig={boardConfig}
									tintingConfig={tintingConfig}
									navThemingMode={navThemingMode}
									advancedParameters={advancedParameters}
									shouldEnableNavCustomization={enableNavCustomization}
									shouldEnableBoardCustomization={enableBoardCustomization}
									appColorMode={appColorMode}
									onTopNavThemeChange={setTopNavTheme}
									onBoardConfigChange={setBoardConfig}
									onTintingConfigChange={setTintingConfig}
									onNavThemingModeChange={setNavThemingMode}
									onAdvancedParametersChange={setAdvancedParameters}
									onEnableNavCustomizationChange={setEnableNavCustomization}
									onEnableBoardCustomizationChange={setEnableBoardCustomization}
									onAppColorModeChange={(mode) => setAppColorMode(mode)}
								/>
								<PanelSplitter label="Resize panel" />
							</Panel>
						</Root>
					</div>
				</div>
			</WithResponsiveViewport>
		</Fragment>
	);
}

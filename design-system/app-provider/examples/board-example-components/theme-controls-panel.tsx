/**
 * @jsxRuntime classic
 * @jsx jsx
 */

import { type CSSProperties, Fragment, type JSX, useState } from 'react';

import { jsx } from '@compiled/react';

import { useColorMode } from '@atlaskit/app-provider/use-color-mode';
import { useSetColorMode } from '@atlaskit/app-provider/use-set-color-mode';
import { cssMap, cx } from '@atlaskit/css';
import Heading from '@atlaskit/heading/heading';
import { JiraIcon } from '@atlaskit/logo/jira/icon';
import { Box } from '@atlaskit/primitives/compiled/box';
import { Stack } from '@atlaskit/primitives/compiled/stack';
import { Text } from '@atlaskit/primitives/compiled/text';
import Range from '@atlaskit/range/range';
import Tab from '@atlaskit/tabs/tab';
import TabList from '@atlaskit/tabs/tab-list';
import TabPanel from '@atlaskit/tabs/tab-panel';
import Tabs from '@atlaskit/tabs/tabs';
import { token } from '@atlaskit/tokens';

import { Accordion } from './accordion';
import { ColorInput } from './color-input';
import { ColorModePicker } from './color-mode-picker';
import { BOARD_TEMPLATES, LOGO_TEMPLATES, type LogoTemplate } from './constants';
import { FileUploadButton } from './file-upload-button';
import { LogoUpload } from './logo-upload';
import { type ThemeColorModes } from './profile-theme-controls';
import { SectionHeader } from './section-header';
import { ColorSwatch, TemplateDivider, TemplateGrid, TemplateImagePreview } from './template-grid';
import { NavThemingThumbnail, ThemingApproachPicker } from './theming-approach-picker';
import { ToggleWithLabel } from './toggle-with-label';
import type {
	AdvancedParameters,
	BoardConfig,
	BoardTemplate,
	NavThemingMode,
	ThemeConfig,
	TintingConfig,
} from './types';
import {
	calculateAccessibleForegroundColor,
	lightenColorByHct,
	setColorLightnessByHct,
} from './utils/color-utils';

const panelStyles = cssMap({
	root: {
		display: 'flex',
		flexDirection: 'column',
		height: '100%',
		minHeight: '0px',
	},
	header: {
		paddingInline: token('space.300'),
		paddingBlock: token('space.150'),
		justifyContent: 'space-between',
		alignItems: 'center',
		backgroundColor: token('elevation.surface'),
	},
	tabsWrapper: {
		border: `0 solid ${token('color.border')}`,
		borderBlockEndWidth: token('border.width'),
		backgroundColor: token('elevation.surface'),
		width: '100%',
		display: 'flex',
		flexDirection: 'column',
		flex: 1,
		minHeight: '0px',
	},
	tabListWrapper: {
		paddingInline: token('space.300'),
		flexShrink: 0,
	},
	tabPanel: {
		flex: 1,
		display: 'flex',
		flexDirection: 'column',
		minHeight: '0px',
		paddingInline: token('space.300'),
		width: '100%',
		minWidth: '0px',
		position: 'relative',
		overflow: 'hidden',
	},
	body: {
		flex: 1,
		display: 'flex',
		flexDirection: 'column',
		paddingBlock: token('space.300'),
		gap: token('space.250'),
		width: '100%',
		minWidth: '0px',
		minHeight: '0px',
	},
	templatesContainer: {
		marginBlockStart: 'auto',
		paddingBlockStart: token('space.300'),
		position: 'relative',
	},
	templatesContainerFloating: {
		position: 'absolute',
		insetBlockEnd: 0,
		insetInlineStart: 0,
		insetInlineEnd: 0,
		zIndex: 100,
		backgroundColor: token('elevation.surface'),
		boxShadow: token('elevation.shadow.overlay'),
		paddingBlockStart: token('space.300'),
		paddingInline: token('space.300'),
		maxHeight: '80vh',
		overflowY: 'auto',
		marginBlockStart: 0,
	},
	palette: {
		display: 'flex',
		flexDirection: 'column',
		height: '100%',
		width: '100%',
	},
	paletteLogo: {
		display: 'flex',
		alignItems: 'center',
		justifyContent: 'flex-start',
		paddingInline: token('space.100'),
		paddingBlock: token('space.100'),
		height: '32px',
		minHeight: '0px',
		overflow: 'hidden',
	},
	paletteLogoImage: {
		maxWidth: '100%',
		maxHeight: '100%',
		width: 'auto',
		height: 'auto',
		objectFit: 'contain',
	},
	paletteLogoText: {
		display: 'flex',
		alignItems: 'center',
		gap: token('space.075'),
	},
	paletteLogoIcon: {
		flexShrink: 0,
		display: 'flex',
		alignItems: 'center',
		justifyContent: 'center',
	},
	paletteMonochromeWrapper: {
		display: 'inline-block',
		// @ts-expect-error - currentColor is a valid CSS value
		color: 'currentColor',
		maxWidth: '100%',
		maxHeight: '100%',
		position: 'relative',
	},
	paletteMonochromeImage: {
		maxWidth: '100%',
		maxHeight: '100%',
		height: 'auto',
		display: 'block',
		opacity: 0,
		width: 'auto',
	},
	paletteMonochromeMask: {
		position: 'absolute',
		insetBlockStart: 0,
		insetInlineStart: 0,
		insetInlineEnd: 0,
		insetBlockEnd: 0,
		width: '100%',
		height: '100%',
		// @ts-expect-error - currentColor is a valid CSS value
		backgroundColor: 'currentColor',
		maskSize: 'contain',
		maskRepeat: 'no-repeat',
		maskPosition: 'center',
		WebkitMaskSize: 'contain',
		WebkitMaskRepeat: 'no-repeat',
		WebkitMaskPosition: 'center',
	},
	paletteDividerHorizontal: {
		flexShrink: 0,
		// @ts-expect-error - token values are valid
		height: token('border.width'),
		width: '100%',
	},
	paletteBottom: {
		display: 'flex',
		flexDirection: 'row',
		height: '42px',
		flexShrink: 0,
		overflow: 'hidden',
	},
	paletteSwatch: {
		flex: 1,
		height: '100%',
		minWidth: '0px',
	},
	paletteThumbnail: {
		flex: 1,
		display: 'flex',
		alignItems: 'center',
		justifyContent: 'center',
		height: '100%',
		minWidth: '0px',
		overflow: 'hidden',
		paddingBlockStart: token('space.050'),
		paddingInlineEnd: token('space.050'),
		paddingBlockEnd: token('space.050'),
		paddingInlineStart: token('space.050'),
	},
	paletteDivider: {
		flexShrink: 0,
		// @ts-expect-error - token values are valid
		width: token('border.width'),
		height: '100%',
	},
});

export interface ThemeControlsPanelProps {
	topNavTheme: ThemeConfig;
	boardConfig: BoardConfig;
	tintingConfig: TintingConfig;
	navThemingMode: NavThemingMode;
	advancedParameters: AdvancedParameters;
	shouldEnableNavCustomization: boolean;
	shouldEnableBoardCustomization: boolean;
	appColorMode?: ThemeColorModes;
	onTopNavThemeChange: (theme: ThemeConfig) => void;
	onBoardConfigChange: (config: BoardConfig) => void;
	onTintingConfigChange: (config: TintingConfig) => void;
	onNavThemingModeChange: (mode: NavThemingMode) => void;
	onAdvancedParametersChange: (params: AdvancedParameters) => void;
	onEnableNavCustomizationChange: (enabled: boolean) => void;
	onEnableBoardCustomizationChange: (enabled: boolean) => void;
	onAppColorModeChange?: (mode: ThemeColorModes) => void;
}

const isBoardTemplateActive = (template: BoardTemplate, boardConfig: BoardConfig): boolean => {
	return (
		template.theme.backgroundColor === boardConfig.backgroundColor &&
		template.theme.foregroundColor === boardConfig.foregroundColor &&
		template.imageUrl === boardConfig.bannerImageUrl &&
		boardConfig.showImage === true
	);
};

export const ThemeControlsPanel = ({
	topNavTheme,
	boardConfig,
	tintingConfig,
	navThemingMode,
	advancedParameters,
	shouldEnableNavCustomization: _enableNavCustomization,
	shouldEnableBoardCustomization: enableBoardCustomization,
	appColorMode,
	onTopNavThemeChange,
	onBoardConfigChange,
	onTintingConfigChange,
	onNavThemingModeChange,
	onAdvancedParametersChange,
	onEnableNavCustomizationChange: _onEnableNavCustomizationChange,
	onEnableBoardCustomizationChange,
	onAppColorModeChange,
}: ThemeControlsPanelProps): JSX.Element => {
	const [selectedTab, setSelectedTab] = useState(0);
	const [isAdminTemplatesExpanded, setIsAdminTemplatesExpanded] = useState(false);
	const [isUserTemplatesExpanded, setIsUserTemplatesExpanded] = useState(false);
	const [isBoardTemplatesExpanded, setIsBoardTemplatesExpanded] = useState(false);
	const resolvedColorMode = useColorMode();
	const setAppProviderColorMode = useSetColorMode();
	const isDarkMode = resolvedColorMode === 'dark';

	// Use appColorMode if provided, otherwise default to 'auto'
	const displayColorMode: ThemeColorModes = appColorMode || 'auto';

	// Wrapper to ensure type compatibility with ColorModePicker
	const handleColorModeChange = (mode: 'light' | 'dark' | 'auto') => {
		// Actually set the color mode in AppProvider
		setAppProviderColorMode(mode);
		// Also update the parent component's state
		if (onAppColorModeChange) {
			onAppColorModeChange(mode);
		}
	};

	const handleLogoUpload = (imageUrl: string) => {
		onTopNavThemeChange({
			...topNavTheme,
			logoUrl: imageUrl,
		});
	};

	const getNavBackgroundColor = (brandColor: string, mode: NavThemingMode): string => {
		if (mode === 'bold') {
			return brandColor;
		} else if (mode === 'subtle' && advancedParameters.tintNavBackground !== false) {
			return setColorLightnessByHct(brandColor, advancedParameters.subtleLightness, isDarkMode);
		} else {
			// 'none' or 'subtle' with nav background disabled - use default background
			return isDarkMode ? '#161A1D' : '#FFFFFF';
		}
	};

	const handleLogoTemplateSelect = (template: LogoTemplate) => {
		onTopNavThemeChange({
			...topNavTheme,
			logoUrl: template.logoUrl,
			logoMonochrome: template.logoMonochrome,
		});
		onTintingConfigChange({
			...tintingConfig,
			brandColor: template.brandColor,
		});
		onNavThemingModeChange(template.navThemingMode);
	};

	const handleBoardTemplateSelect = (template: BoardTemplate) => {
		onBoardConfigChange({
			...boardConfig,
			...template.theme,
			bannerImageUrl: template.imageUrl,
			showImage: true,
		});
	};

	const handleFileUpload = (imageUrl: string) => {
		onBoardConfigChange({
			...boardConfig,
			bannerImageUrl: imageUrl,
			showImage: true,
		});
	};

	const handleImageRemove = () => {
		onBoardConfigChange({
			...boardConfig,
			bannerImageUrl: '',
			showImage: false,
		});
	};

	const handleLogoRemove = () => {
		onTopNavThemeChange({
			...topNavTheme,
			logoUrl: undefined,
			logoMonochrome: undefined,
		});
	};

	const handleLogoMonochromeChange = (isMonochrome: boolean) => {
		onTopNavThemeChange({
			...topNavTheme,
			logoMonochrome: isMonochrome,
		});
	};

	return (
		<Box xcss={panelStyles.root}>
			<Box xcss={panelStyles.header}>
				<Heading as="h2" size="xsmall">
					Settings
				</Heading>
			</Box>

			<Box xcss={panelStyles.tabsWrapper}>
				<Tabs
					id="theme-settings-tabs"
					selected={selectedTab}
					onChange={(index) => setSelectedTab(index)}
				>
					<Box xcss={panelStyles.tabListWrapper}>
						<TabList>
							<Tab>Admin settings</Tab>
							<Tab>User settings</Tab>
							<Tab>Board settings</Tab>
						</TabList>
					</Box>

					{/* Admin settings tab */}
					<TabPanel>
						<Box xcss={panelStyles.tabPanel}>
							<Box xcss={panelStyles.body}>
								<Stack space="space.200">
									{/* Admin settings */}
									<SectionHeader title="Admin settings" subtitle="Look and Feel" />

									<Stack space="space.200">
										<ColorInput
											id="brand-color"
											name="Brand color"
											description={
												navThemingMode === 'bold'
													? 'Brand color used as the background color for bold theming'
													: navThemingMode === 'subtle'
														? 'Brand color used for theme tinting'
														: 'Brand color for navigation theming'
											}
											value={tintingConfig.brandColor || ''}
											onChange={(value) =>
												onTintingConfigChange({
													...tintingConfig,
													brandColor: value as `#${string}`,
												})
											}
										/>

										<LogoUpload
											logoUrl={topNavTheme.logoUrl}
											logoMonochrome={topNavTheme.logoMonochrome}
											brandColor={tintingConfig.brandColor}
											navThemingMode={navThemingMode}
											onLogoUpload={handleLogoUpload}
											onLogoRemove={handleLogoRemove}
											onMonochromeChange={handleLogoMonochromeChange}
										/>
									</Stack>
								</Stack>

								{/* Templates at the bottom */}
								<Box
									xcss={cx(
										panelStyles.templatesContainer,
										isAdminTemplatesExpanded && panelStyles.templatesContainerFloating,
									)}
								>
									<Accordion title="Templates" onExpandedChange={setIsAdminTemplatesExpanded}>
										<TemplateGrid
											templates={LOGO_TEMPLATES}
											isActive={(template) =>
												template.logoUrl === topNavTheme.logoUrl &&
												template.brandColor === tintingConfig.brandColor &&
												template.navThemingMode === navThemingMode &&
												(template.logoMonochrome === undefined ||
													template.logoMonochrome === topNavTheme.logoMonochrome)
											}
											onSelect={handleLogoTemplateSelect}
											getKey={(template) => template.id}
											variant="rectangle"
											renderContent={(template) => {
												const navBgColor = getNavBackgroundColor(
													template.brandColor,
													template.navThemingMode,
												);
												const defaultBgColor = isDarkMode ? '#161A1D' : '#FFFFFF';
												const hasCustomBackground = navBgColor !== defaultBgColor;
												const logoFgColor = hasCustomBackground
													? calculateAccessibleForegroundColor(navBgColor)
													: undefined;
												return (
													<Box xcss={panelStyles.palette}>
														<Box
															xcss={panelStyles.paletteLogo}
															// eslint-disable-next-line @atlaskit/ui-styling-standard/enforce-style-prop
															style={{
																backgroundColor: navBgColor,
																color: template.logoMonochrome ? logoFgColor : undefined,
															}}
														>
															{template.logoUrl === undefined ? (
																<Box xcss={panelStyles.paletteLogoText}>
																	<Box xcss={panelStyles.paletteLogoIcon}>
																		<JiraIcon
																			// eslint-disable-next-line @atlaskit/design-system/no-deprecated-apis
																			iconColor={logoFgColor}
																			size="small"
																		/>
																	</Box>
																	<span
																		// eslint-disable-next-line @atlaskit/ui-styling-standard/enforce-style-prop
																		style={logoFgColor ? { color: logoFgColor } : undefined}
																	>
																		<Text
																			size="small"
																			weight="medium"
																			color={logoFgColor ? 'inherit' : 'color.text'}
																		>
																			Jira
																		</Text>
																	</span>
																</Box>
															) : template.logoMonochrome ? (
																<span css={panelStyles.paletteMonochromeWrapper}>
																	{/* eslint-disable-next-line @atlaskit/design-system/no-html-image */}
																	<img
																		alt=""
																		src={template.logoUrl}
																		css={panelStyles.paletteMonochromeImage}
																	/>
																	<span
																		css={panelStyles.paletteMonochromeMask}
																		// eslint-disable-next-line @atlaskit/ui-styling-standard/enforce-style-prop
																		style={
																			{
																				maskImage: `url(${template.logoUrl})`,
																				WebkitMaskImage: `url(${template.logoUrl})`,
																			} as CSSProperties
																		}
																	/>
																</span>
															) : (
																/* eslint-disable-next-line @atlaskit/design-system/no-html-image */
																<img
																	src={template.logoUrl}
																	alt={template.name}
																	css={panelStyles.paletteLogoImage}
																/>
															)}
														</Box>
														<Box
															xcss={panelStyles.paletteDividerHorizontal}
															// eslint-disable-next-line @atlaskit/ui-styling-standard/enforce-style-prop
															style={{
																// eslint-disable-next-line @atlaskit/ui-styling-standard/no-imported-style-values
																backgroundColor: lightenColorByHct(template.brandColor, 20, false),
															}}
														/>
														<Box xcss={panelStyles.paletteBottom}>
															<Box
																xcss={panelStyles.paletteSwatch}
																// eslint-disable-next-line @atlaskit/ui-styling-standard/enforce-style-prop
																style={{ backgroundColor: template.brandColor }}
															/>
															<Box
																xcss={panelStyles.paletteDivider}
																// eslint-disable-next-line @atlaskit/ui-styling-standard/enforce-style-prop
																style={{
																	// eslint-disable-next-line @atlaskit/ui-styling-standard/no-imported-style-values
																	backgroundColor: lightenColorByHct(
																		template.brandColor,
																		20,
																		false,
																	),
																}}
															/>
															<Box xcss={panelStyles.paletteThumbnail}>
																<NavThemingThumbnail
																	mode={template.navThemingMode}
																	brandColor={template.brandColor}
																	isDarkMode={isDarkMode}
																	size="small"
																/>
															</Box>
														</Box>
													</Box>
												);
											}}
										/>
									</Accordion>
								</Box>
							</Box>
						</Box>
					</TabPanel>

					{/* User settings tab */}
					<TabPanel>
						<Box xcss={panelStyles.tabPanel}>
							<Box xcss={panelStyles.body}>
								<Stack space="space.200">
									{/* User Appearance settings */}
									<SectionHeader title="User settings" subtitle="Appearance" />

									<Stack space="space.200">
										{/* Color mode */}
										{onAppColorModeChange && (
											<Stack space="space.100">
												<Heading as="h4" size="xsmall">
													Color mode
												</Heading>
												<ColorModePicker
													colorMode={displayColorMode}
													onColorModeChange={handleColorModeChange}
												/>
											</Stack>
										)}

										{/* Company color theme */}
										<Stack space="space.100">
											<Heading as="h4" size="xsmall">
												Company color theme
											</Heading>
											<ThemingApproachPicker
												navThemingMode={navThemingMode}
												brandColor={tintingConfig.brandColor}
												onNavThemingModeChange={onNavThemingModeChange}
											/>

											<Accordion
												title="Advanced theming settings"
												isDisabled={navThemingMode === 'none'}
											>
												<Stack space="space.200">
													{navThemingMode !== 'none' && (
														<ToggleWithLabel
															id="theme-whole-nav"
															label="Theme whole navigation"
															isChecked={advancedParameters.themeWholeNav ?? false}
															onChange={(event) =>
																onAdvancedParametersChange({
																	...advancedParameters,
																	themeWholeNav: event.target.checked,
																})
															}
														/>
													)}
													{navThemingMode === 'bold' && (
														<Fragment>
															<ToggleWithLabel
																id="auto-foreground"
																label="Automatic foreground color"
																isChecked={topNavTheme.autoForegroundColor !== false}
																onChange={(event) =>
																	onTopNavThemeChange({
																		...topNavTheme,
																		autoForegroundColor: event.target.checked,
																	})
																}
															/>
															{/* Only offer a manual colour when it would be used, rather than disabling it. */}
															{topNavTheme.autoForegroundColor === false && (
																<ColorInput
																	id="nav-foreground"
																	name="Foreground color"
																	description="Text and icon color for the navigation"
																	value={topNavTheme.foregroundColor || ''}
																	onChange={(value) =>
																		onTopNavThemeChange({
																			...topNavTheme,
																			foregroundColor: value,
																		})
																	}
																/>
															)}
														</Fragment>
													)}

													{navThemingMode === 'subtle' && (
														<Fragment>
															<ToggleWithLabel
																id="tint-nav-background"
																label="Navigation background"
																isChecked={advancedParameters.tintNavBackground ?? false}
																onChange={(event) =>
																	onAdvancedParametersChange({
																		...advancedParameters,
																		tintNavBackground: event.target.checked,
																	})
																}
																description="Apply brand color tinting to navigation backgrounds. When disabled, only buttons and controls are tinted."
															/>

															<ToggleWithLabel
																id="tint-neutrals"
																label="Neutral palette tinting"
																isChecked={advancedParameters.tintNeutrals ?? false}
																onChange={(event) =>
																	onAdvancedParametersChange({
																		...advancedParameters,
																		tintNeutrals: event.target.checked,
																	})
																}
																description="Regenerate neutral palette colors with the same relative luminance as the default neutrals, but with hue and saturation shifted to match the brand color."
															/>

															<ToggleWithLabel
																id="tint-surface"
																label="Surface customization"
																isChecked={advancedParameters.tintSurface ?? false}
																onChange={(event) =>
																	onAdvancedParametersChange({
																		...advancedParameters,
																		tintSurface: event.target.checked,
																	})
																}
																description="Customize surface colors to target 0.93 relative luminance in light mode, and equivalent luminance in dark mode. Overlay surface stays at the same relative luminance in dark mode."
															/>

															<Stack space="space.100">
																<Text size="small" weight="bold" color="color.text.subtle">
																	Subtle mode lightness
																</Text>
																<Text size="small" color="color.text.subtle">
																	HCT tone (WCAG lightness, 80-100) for the background color in
																	subtle mode. Higher values create lighter backgrounds. The brand
																	color will be adjusted to this tone while preserving hue and
																	automatically adjusting chroma to stay within gamut.
																</Text>
																<Range
																	value={advancedParameters.subtleLightness}
																	min={80}
																	max={100}
																	step={1}
																	onChange={(value) =>
																		onAdvancedParametersChange({
																			...advancedParameters,
																			subtleLightness: value,
																		})
																	}
																	testId="subtle-lightness-slider"
																/>
																<Text size="small" color="color.text.subtle">
																	{advancedParameters.subtleLightness}
																</Text>
															</Stack>
														</Fragment>
													)}
												</Stack>
											</Accordion>
										</Stack>
									</Stack>
								</Stack>

								{/* Templates at the bottom */}
								<Box
									xcss={cx(
										panelStyles.templatesContainer,
										isUserTemplatesExpanded && panelStyles.templatesContainerFloating,
									)}
								>
									<Accordion title="Templates" onExpandedChange={setIsUserTemplatesExpanded}>
										<TemplateGrid
											templates={LOGO_TEMPLATES}
											isActive={(template) =>
												template.logoUrl === topNavTheme.logoUrl &&
												template.brandColor === tintingConfig.brandColor &&
												template.navThemingMode === navThemingMode &&
												(template.logoMonochrome === undefined ||
													template.logoMonochrome === topNavTheme.logoMonochrome)
											}
											onSelect={handleLogoTemplateSelect}
											getKey={(template) => template.id}
											variant="rectangle"
											renderContent={(template) => {
												const navBgColor = getNavBackgroundColor(
													template.brandColor,
													template.navThemingMode,
												);
												const defaultBgColor = isDarkMode ? '#161A1D' : '#FFFFFF';
												const hasCustomBackground = navBgColor !== defaultBgColor;
												const logoFgColor = hasCustomBackground
													? calculateAccessibleForegroundColor(navBgColor)
													: undefined;
												return (
													<Box xcss={panelStyles.palette}>
														<Box
															xcss={panelStyles.paletteLogo}
															// eslint-disable-next-line @atlaskit/ui-styling-standard/enforce-style-prop
															style={{
																backgroundColor: navBgColor,
																color: template.logoMonochrome ? logoFgColor : undefined,
															}}
														>
															{template.logoUrl === undefined ? (
																<Box xcss={panelStyles.paletteLogoText}>
																	<Box xcss={panelStyles.paletteLogoIcon}>
																		<JiraIcon
																			// eslint-disable-next-line @atlaskit/design-system/no-deprecated-apis
																			iconColor={logoFgColor}
																			size="small"
																		/>
																	</Box>
																	<span
																		// eslint-disable-next-line @atlaskit/ui-styling-standard/enforce-style-prop
																		style={logoFgColor ? { color: logoFgColor } : undefined}
																	>
																		<Text
																			size="small"
																			weight="medium"
																			color={logoFgColor ? 'inherit' : 'color.text'}
																		>
																			Jira
																		</Text>
																	</span>
																</Box>
															) : template.logoMonochrome ? (
																<span css={panelStyles.paletteMonochromeWrapper}>
																	{/* eslint-disable-next-line @atlaskit/design-system/no-html-image */}
																	<img
																		alt=""
																		src={template.logoUrl}
																		css={panelStyles.paletteMonochromeImage}
																	/>
																	<span
																		css={panelStyles.paletteMonochromeMask}
																		// eslint-disable-next-line @atlaskit/ui-styling-standard/enforce-style-prop
																		style={
																			{
																				maskImage: `url(${template.logoUrl})`,
																				WebkitMaskImage: `url(${template.logoUrl})`,
																			} as CSSProperties
																		}
																	/>
																</span>
															) : (
																/* eslint-disable-next-line @atlaskit/design-system/no-html-image */
																<img
																	src={template.logoUrl}
																	alt={template.name}
																	css={panelStyles.paletteLogoImage}
																/>
															)}
														</Box>
														<Box
															xcss={panelStyles.paletteDividerHorizontal}
															// eslint-disable-next-line @atlaskit/ui-styling-standard/enforce-style-prop
															style={{
																// eslint-disable-next-line @atlaskit/ui-styling-standard/no-imported-style-values
																backgroundColor: lightenColorByHct(template.brandColor, 20, false),
															}}
														/>
														<Box xcss={panelStyles.paletteBottom}>
															<Box
																xcss={panelStyles.paletteSwatch}
																// eslint-disable-next-line @atlaskit/ui-styling-standard/enforce-style-prop
																style={{ backgroundColor: template.brandColor }}
															/>
															<Box
																xcss={panelStyles.paletteDivider}
																// eslint-disable-next-line @atlaskit/ui-styling-standard/enforce-style-prop
																style={{
																	// eslint-disable-next-line @atlaskit/ui-styling-standard/no-imported-style-values
																	backgroundColor: lightenColorByHct(
																		template.brandColor,
																		20,
																		false,
																	),
																}}
															/>
															<Box xcss={panelStyles.paletteThumbnail}>
																<NavThemingThumbnail
																	mode={template.navThemingMode}
																	brandColor={template.brandColor}
																	isDarkMode={isDarkMode}
																	size="small"
																/>
															</Box>
														</Box>
													</Box>
												);
											}}
										/>
									</Accordion>
								</Box>
							</Box>
						</Box>
					</TabPanel>

					{/* Board settings tab */}
					<TabPanel>
						<Box xcss={panelStyles.tabPanel}>
							<Box xcss={panelStyles.body}>
								<Stack space="space.200">
									<SectionHeader
										title="Board settings"
										subtitle="Personal Settings"
										isEnabled={enableBoardCustomization}
										onToggleChange={onEnableBoardCustomizationChange}
										toggleLabel="Enable customization"
									/>

									{enableBoardCustomization && (
										<Fragment>
											<ColorInput
												id="board-background"
												name="Background color"
												description="Background color for the board section"
												value={boardConfig.backgroundColor || ''}
												onChange={(value) =>
													onBoardConfigChange({ ...boardConfig, backgroundColor: value })
												}
											/>
											<Accordion title="Advanced options">
												<Stack space="space.100">
													<ToggleWithLabel
														id="board-auto-foreground"
														label="Automatically calculate foreground color"
														isChecked={boardConfig.autoForegroundColor !== false}
														onChange={(event) =>
															onBoardConfigChange({
																...boardConfig,
																autoForegroundColor: event.target.checked,
															})
														}
													/>
													{/* Only offer a manual colour when it would be used, rather than disabling it. */}
													{boardConfig.autoForegroundColor === false && (
														<ColorInput
															id="board-foreground"
															name="Foreground color"
															description="Text color for the board section"
															value={boardConfig.foregroundColor || ''}
															onChange={(value) =>
																onBoardConfigChange({ ...boardConfig, foregroundColor: value })
															}
														/>
													)}

													<ToggleWithLabel
														id="disable-dynamic-theming"
														label="Disable dynamic theming"
														isChecked={boardConfig.disableDynamicTheming === true}
														onChange={(event) =>
															onBoardConfigChange({
																...boardConfig,
																disableDynamicTheming: event.target.checked,
															})
														}
														description="Disables dynamic themes and instead switches between light and dark theme based on the background color."
													/>
												</Stack>
											</Accordion>
											<FileUploadButton
												label="Background image"
												isEnabled={boardConfig.showImage}
												onToggleChange={(enabled) =>
													onBoardConfigChange({ ...boardConfig, showImage: enabled })
												}
												onFileUpload={handleFileUpload}
												uploadButtonLabel="Upload custom image"
												imageUrl={boardConfig.bannerImageUrl}
												onImageRemove={handleImageRemove}
											/>
										</Fragment>
									)}
								</Stack>

								{/* Templates at the bottom */}
								{enableBoardCustomization && (
									<Box
										xcss={cx(
											panelStyles.templatesContainer,
											isBoardTemplatesExpanded && panelStyles.templatesContainerFloating,
										)}
									>
										<Accordion title="Templates" onExpandedChange={setIsBoardTemplatesExpanded}>
											<TemplateGrid
												templates={BOARD_TEMPLATES}
												isActive={(template) => isBoardTemplateActive(template, boardConfig)}
												onSelect={handleBoardTemplateSelect}
												getKey={(template) => template.id}
												variant="column"
												renderContent={(template) => (
													<Fragment>
														<ColorSwatch color={template.theme.backgroundColor} variant="column" />
														<TemplateDivider color={template.theme.backgroundColor} />
														<TemplateImagePreview
															imageUrl={template.imageUrl}
															name={template.name}
														/>
													</Fragment>
												)}
											/>
										</Accordion>
									</Box>
								)}
							</Box>
						</Box>
					</TabPanel>
				</Tabs>
			</Box>
		</Box>
	);
};

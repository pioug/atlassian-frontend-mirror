/**
 * @jsxRuntime classic
 */
/** @jsx jsx */
import { useCallback, useEffect, useState } from 'react';

// eslint-disable-next-line @atlaskit/ui-styling-standard/use-compiled -- Ignored via go/DSP-18766
import { css, jsx } from '@emotion/react';
import debounce from 'lodash/debounce';

import ButtonGroup from '@atlaskit/button/button-group';
import Button from '@atlaskit/button/new';
import Calendar from '@atlaskit/calendar';
import Checkbox from '@atlaskit/checkbox';
import { Label } from '@atlaskit/form';
import Heading from '@atlaskit/heading';
import InlineMessage from '@atlaskit/inline-message';
import Link from '@atlaskit/link';
import Lozenge from '@atlaskit/lozenge';
import { Box, Inline, Stack, xcss } from '@atlaskit/primitives';
import { Radio } from '@atlaskit/radio';
import Select from '@atlaskit/select';

import { setGlobalTheme, token } from '../src';
import { type ThemeOptionsSchema } from '../src/theme-config';
import { getContrastRatio } from '../src/utils/color-utils';
import {
	generateColors,
	generateTokenMapWithContrastCheck,
} from '../src/utils/generate-custom-color-ramp';

import Accordion from './contrast-checker-utils/components/accordion';
import ContrastCard from './contrast-checker-utils/components/contrast-card';
import CopyButton from './utils/copy-button';
import {
	customThemeContrastChecker,
	type CustomThemeContrastCheckResult,
} from './utils/custom-theme-contrast-checker';
import getFigmaVariableScript from './utils/get-figma-variable-script';

const colorContainerStyles = css({
	boxSizing: 'border-box',
	height: '72px',
	position: 'relative',
	flex: 1,
	paddingBlockStart: '28px',
	textAlign: 'center',
	transition: 'all 0.2s',
	'&:hover': {
		height: '80px',
		borderRadius: '3px 3px 0 0',
		marginBlockStart: '-8px',
		paddingBlockStart: '8px',
		// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors -- Ignored via go/DSP-18766
		span: {
			insetBlockEnd: 8,
			opacity: 1,
		},
		// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors -- Ignored via go/DSP-18766
		p: {
			opacity: 0,
		},
	},
});

type HEX = `#${string}`;

export default () => {
	const [customTheme, setCustomTheme] = useState<ThemeOptionsSchema>({
		brandColor: '#65D26E',
	});
	const [colorMode, setColorMode] = useState<'light' | 'dark'>('light');
	const [themeRamp, setThemeRamp] = useState<string[]>([]);
	const [darkTokens, setDarkTokens] = useState<{
		[key: string]: number | string;
	}>({});
	const [lightTokens, setLightTokens] = useState<{
		[key: string]: number | string;
	}>({});
	const [contrastCheckResults, setContrastCheckResults] = useState<
		CustomThemeContrastCheckResult[]
	>([]);

	useEffect(() => {
		setGlobalTheme({
			colorMode: colorMode,
			UNSAFE_themeOptions: customTheme,
			spacing: 'spacing',
		});

		const themeRamp = generateColors(customTheme.brandColor).ramp;
		setThemeRamp(themeRamp);

		const tokenMaps = generateTokenMapWithContrastCheck(customTheme.brandColor, 'auto', themeRamp);
		setLightTokens(tokenMaps.light!);
		setDarkTokens(tokenMaps.dark!);

		const contrastCheckResults = customThemeContrastChecker({
			customThemeTokenMap: colorMode === 'light' ? tokenMaps.light! : tokenMaps.dark!,
			mode: colorMode,
			themeRamp,
		});
		setContrastCheckResults(contrastCheckResults);
	}, [customTheme, colorMode]);

	const debouncedBrandColorChange = debounce((brandColor: HEX) => {
		setCustomTheme({
			...customTheme,
			brandColor,
		});
	}, 150);

	const getCopiedValue = () => {
		// Copy script to clipboard
		const mappedLightTokens: { [index: string]: string } = {};
		Object.keys(lightTokens).forEach((name) => {
			const lightValue = lightTokens[name];
			mappedLightTokens[name] = typeof lightValue === 'number' ? themeRamp[lightValue] : lightValue;
		});
		const mappedDarkTokens: { [index: string]: string } = {};
		Object.keys(darkTokens).forEach((name) => {
			const darkValue = darkTokens[name];
			mappedDarkTokens[name] = typeof darkValue === 'number' ? themeRamp[darkValue] : darkValue;
		});
		return getFigmaVariableScript(customTheme, mappedLightTokens, mappedDarkTokens);
	};

	const onColorChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		debouncedBrandColorChange(e.target.value as HEX);
	};

	const betterContrastResults = contrastCheckResults.filter(
		(pairing) => pairing.contrast >= pairing.previousContrast,
	);

	const worseContrastResults = contrastCheckResults.filter(
		(pairing) => pairing.contrast < pairing.previousContrast,
	);

	const newBreachContrastResults = contrastCheckResults.filter(
		(pairing) =>
			pairing.contrast < pairing.desiredContrast &&
			pairing.previousContrast > pairing.desiredContrast,
	);

	const renderContrastResults = useCallback(
		(results: CustomThemeContrastCheckResult[]) => {
			return results.map((pairing) => {
				const {
					foreground: { tokenName: foregroundName, color: foregroundValue },
					background: { tokenName: backgroundName, color: backgroundValue },
					contrast,
					previousContrast,
				} = pairing;
				return (
					<ContrastCard
						key={foregroundName + '-' + backgroundName}
						foregroundName={foregroundName}
						foregroundValue={foregroundValue}
						backgroundName={backgroundName}
						backgroundValue={backgroundValue}
						contrastBase={previousContrast.toPrecision(4)}
						contrastCustom={contrast.toPrecision(4)}
						baseThemeType={colorMode}
						// eslint-disable-next-line @atlaskit/design-system/no-unsafe-design-token-usage, @atlaskit/ui-styling-standard/no-imported-style-values -- Ignored via go/DSP-18766
						style={{ marginBottom: token('space.050', '4px') }}
					/>
				);
			});
		},
		[colorMode],
	);

	const renderTokenColor = (value: number | string, isLight?: boolean) => {
		const color = typeof value === 'string' ? value : themeRamp[value];
		const rampValue = typeof value === 'string' ? value : `X${value + 1}00`;
		return (
			<code
				style={{
					// eslint-disable-next-line @atlaskit/design-system/ensure-design-token-usage, @atlaskit/ui-styling-standard/enforce-style-prop -- Ignored via go/DSP-18766
					backgroundColor: color,
					// eslint-disable-next-line @atlaskit/ui-styling-standard/no-imported-style-values -- Ignored via go/DSP-18766
					color: getContrastRatio('#ffffff', color) >= 4.5 ? 'white' : 'black',
					// eslint-disable-next-line @atlaskit/ui-styling-standard/enforce-style-prop -- Ignored via go/DSP-18766
					borderRadius: '24px',
					// eslint-disable-next-line @atlaskit/ui-styling-standard/enforce-style-prop -- Ignored via go/DSP-18766
					padding: '0 4px',
					// eslint-disable-next-line @atlaskit/ui-styling-standard/enforce-style-prop -- Ignored via go/DSP-18766
					whiteSpace: 'nowrap',
				}}
			>
				{isLight ? 'Light: ' : 'Dark: '}
				{rampValue}
			</code>
		);
	};

	return (
		<Box padding="space.200" testId="custom-theming">
			<Stack space={'space.200'}>
				<Box
					padding="space.200"
					// eslint-disable-next-line @atlaskit/ui-styling-standard/enforce-style-prop -- Ignored via go/DSP-18766
					style={{ width: 'fit-content' }}
					// eslint-disable-next-line @atlaskit/ui-styling-standard/no-imported-style-values -- Ignored via go/DSP-18766
					xcss={xcss({
						borderColor: 'color.border',
						borderWidth: 'border.width',
						borderRadius: 'border.radius.050',
						borderStyle: 'solid',
					})}
				>
					<Stack space="space.100">
						<Inline space="space.100">
							<p id="brandColor">Brand color:</p>
							<input
								aria-labelledby="brandColor"
								type="color"
								value={customTheme?.brandColor}
								onChange={onColorChange}
							/>
						</Inline>

						<Inline space="space.100">
							<p id="baseTheme">Base theme:</p>
							<Select
								aria-labelledby="baseTheme"
								value={
									colorMode === 'light'
										? { label: 'Light mode', value: 'light' }
										: { label: 'Dark mode', value: 'dark' }
								}
								options={[
									{ label: 'Light mode', value: 'light' },
									{ label: 'Dark mode', value: 'dark' },
								]}
								onChange={(e) => setColorMode((e?.value as 'light' | 'dark') || 'light')}
							/>
						</Inline>
						<Inline space="space.100" alignBlock="center">
							<CopyButton content={getCopiedValue} label="Copy Figma Script" />

							<InlineMessage appearance="info">
								<p>
									<strong>Create Figma variables for this custom theme</strong>
								</p>
								<p>
									To add these custom colors as Figma Variables, paste this script into the Figma
									console and press Enter to execute.
								</p>
								<p>
									You can open the console in Figma in the "Plugin" menu (Plugins &gt; Development
									&gt; Open Console), or use the shortcut ⌥⌘I.
								</p>
								<p>
									<Link href="https://www.figma.com/plugin-docs/debugging/">
										Learn more in the Figma docs
									</Link>
								</p>
							</InlineMessage>
						</Inline>
					</Stack>
				</Box>
				{themeRamp.length > 0 && (
					<Inline>
						{themeRamp.map((colorString, i) => (
							<div
								key={colorString}
								css={colorContainerStyles}
								style={{
									background: colorString,
									// eslint-disable-next-line @atlaskit/ui-styling-standard/no-imported-style-values -- Ignored via go/DSP-18766
									color: getContrastRatio('#ffffff', colorString) >= 4.5 ? 'white' : 'black',
								}}
							>
								{colorString === customTheme.brandColor && (
									<Box
										as="p"
										// eslint-disable-next-line @atlaskit/ui-styling-standard/no-imported-style-values -- Ignored via go/DSP-18766
										xcss={xcss({
											width: '100%',
											paddingBlockStart: 'space.100',
											position: 'absolute',
											insetBlockStart: 'space.0',
											transition: 'all 0.2s',
										})}
									>
										Brand
									</Box>
								)}
								<b>
									X{i + 1}
									00
								</b>
								<Box
									as="span"
									// eslint-disable-next-line @atlaskit/ui-styling-standard/no-imported-style-values -- Ignored via go/DSP-18766
									xcss={xcss({
										boxSizing: 'border-box',
										width: '100%',
										position: 'absolute',
										insetBlockEnd: 'space.0',
										insetInlineStart: 'space.0',
										opacity: 0,
										textAlign: 'center',
										transition: 'all 0.3s',
									})}
								>
									{colorString}
								</Box>
							</div>
						))}
					</Inline>
				)}
				<Stack space="space.100">
					<Heading level="h700">Modified tokens</Heading>

					{Object.entries(lightTokens).map(([tokenName, value]) => {
						return (
							<Box
								key={tokenName}
								paddingInline="space.100"
								paddingBlock="space.050"
								// eslint-disable-next-line @atlaskit/ui-styling-standard/no-imported-style-values -- Ignored via go/DSP-18766
								xcss={xcss({
									// eslint-disable-next-line @atlaskit/ui-styling-standard/no-imported-style-values, @atlaskit/ui-styling-standard/no-unsafe-values -- Ignored via go/DSP-18766
									border: `1px solid ${token('color.border')}`,
									width: 'fit-content',
									borderRadius: 'border.radius.circle',
								})}
							>
								<Inline space="space.100">
									{renderTokenColor(value, true)}
									{renderTokenColor(darkTokens[tokenName])}
									<code>{tokenName}</code>
								</Inline>
							</Box>
						);
					})}
				</Stack>
				{contrastCheckResults.length ? (
					<Stack space="space.100">
						<Inline space="space.100" alignBlock="center">
							<Heading level="h700">Contrast check results</Heading>
							<Lozenge appearance="moved">{contrastCheckResults.length}</Lozenge>
						</Inline>
						<Accordion
							size={newBreachContrastResults.length}
							appearance="danger"
							description="Pairings that now breach:"
						>
							{renderContrastResults(newBreachContrastResults)}
						</Accordion>
						<Accordion
							size={betterContrastResults.length}
							appearance="success"
							description="Pairings with better contrast:"
						>
							{renderContrastResults(betterContrastResults)}
						</Accordion>
						<Accordion
							size={worseContrastResults.length}
							appearance="warning"
							description="Pairings with worse contrast:"
						>
							{renderContrastResults(worseContrastResults)}
						</Accordion>
					</Stack>
				) : null}
				<Stack space="space.200">
					<Heading level="h700">Component examples</Heading>
					<Inline space="space.100">
						<Stack space="space.100">
							{/* eslint-disable-next-line jsx-a11y/anchor-is-valid */}
							<Link href="atlassian.design">Test link</Link>
							<ButtonGroup label="Button examples">
								<Button appearance="primary">Primary button</Button>
								<Button isSelected={true}>Selected button</Button>
							</ButtonGroup>
							<Stack>
								<Checkbox
									value="Checkbox"
									label="Checkbox"
									isChecked={true}
									name="checkbox-basic"
								/>
								<Radio
									value="Radio"
									label="Radio"
									name="radio-default"
									testId="radio-default"
									isChecked={true}
								/>
							</Stack>
							<Label htmlFor="select-custom-theme">Select example</Label>
							<Select
								inputId="select-custom-theme"
								menuIsOpen={true}
								defaultValue={{ label: 'One', value: 'one' }}
								options={[
									{ label: 'One', value: 'one' },
									{ label: 'Two', value: 'two' },
								]}
							/>
						</Stack>
						<Calendar />
					</Inline>
				</Stack>
			</Stack>
		</Box>
	);
};

/**
 * @jsxRuntime classic
 * @jsx jsx
 */
import React, { useState } from 'react';

import { ThemeProvider } from '@atlaskit/app-provider/theme-provider';
import { useColorMode } from '@atlaskit/app-provider/use-color-mode';
import Button from '@atlaskit/button/default/button';
import { cssMap, cx, jsx } from '@atlaskit/css';
import { Label } from '@atlaskit/form/label/default';
import Heading from '@atlaskit/heading/heading';
import { Grid } from '@atlaskit/primitives/compiled/grid';
import { Inline } from '@atlaskit/primitives/compiled/inline';
import { Pressable } from '@atlaskit/primitives/compiled/pressable';
import { Stack } from '@atlaskit/primitives/compiled/stack';
import { Text } from '@atlaskit/primitives/compiled/text';
import Range from '@atlaskit/range/range';
import Select from '@atlaskit/select/default';
import { token } from '@atlaskit/tokens';
import type { CustomThemeOverrideRegistry } from '@atlaskit/tokens/custom-theme-overrides';

import { CustomThemeShowcase, SyncColorMode } from './shared/custom-theme-showcase';
import { EditorialBrief } from './shared/editorial-brief';

/**
 * Every input is always set in this example, including the optional heading scales, so the
 * controls never have to handle a missing value.
 */
type TypographyOverrides = Required<CustomThemeOverrideRegistry['UNSAFE-typography']['typography']>;

type HeadingScaleKey = Exclude<keyof TypographyOverrides, 'dynamicFontFamily' | 'dynamicFontScale'>;

type FontOption = { label: string; value: string };

const DEFAULT_FONT_FAMILY =
	'"Atlassian Sans", ui-sans-serif, -apple-system, BlinkMacSystemFont, "Segoe UI", Ubuntu, "Helvetica Neue", sans-serif';

/**
 * Web-safe font families that ship with common operating systems, each with fallbacks and a generic
 * family, plus the CSS generic families themselves.
 */
const fontFamilyGroups: { label: string; options: FontOption[] }[] = [
	{
		label: 'Default',
		options: [{ label: 'Atlassian Sans', value: DEFAULT_FONT_FAMILY }],
	},
	{
		label: 'Sans-serif',
		options: [
			{ label: 'Arial', value: 'Arial, Helvetica, sans-serif' },
			{ label: 'Arial Black', value: '"Arial Black", Gadget, sans-serif' },
			{ label: 'Helvetica', value: 'Helvetica, Arial, sans-serif' },
			{ label: 'Verdana', value: 'Verdana, Geneva, sans-serif' },
			{ label: 'Tahoma', value: 'Tahoma, Geneva, sans-serif' },
			{ label: 'Trebuchet MS', value: '"Trebuchet MS", Helvetica, sans-serif' },
			{ label: 'Gill Sans', value: '"Gill Sans", "Gill Sans MT", Calibri, sans-serif' },
			{
				label: 'Lucida Sans',
				value: '"Lucida Sans Unicode", "Lucida Grande", "Lucida Sans", sans-serif',
			},
			{ label: 'Segoe UI', value: '"Segoe UI", Tahoma, Geneva, sans-serif' },
			{ label: 'Impact', value: 'Impact, Haettenschweiler, "Arial Narrow Bold", sans-serif' },
		],
	},
	{
		label: 'Serif',
		options: [
			{ label: 'Times New Roman', value: '"Times New Roman", Times, serif' },
			{ label: 'Georgia', value: 'Georgia, serif' },
			{ label: 'Garamond', value: 'Garamond, "Times New Roman", serif' },
			{ label: 'Palatino', value: '"Palatino Linotype", "Book Antiqua", Palatino, serif' },
			{ label: 'Baskerville', value: 'Baskerville, "Baskerville Old Face", Georgia, serif' },
			{ label: 'Didot', value: 'Didot, "Bodoni MT", "Times New Roman", serif' },
		],
	},
	{
		label: 'Monospace',
		options: [
			{ label: 'Courier New', value: '"Courier New", Courier, monospace' },
			{ label: 'Lucida Console', value: '"Lucida Console", Monaco, monospace' },
			{ label: 'Monaco', value: 'Monaco, Consolas, monospace' },
		],
	},
	{
		label: 'Handwriting',
		options: [
			{ label: 'Comic Sans MS', value: '"Comic Sans MS", "Comic Sans", cursive' },
			{ label: 'Brush Script MT', value: '"Brush Script MT", cursive' },
		],
	},
	{
		label: 'Generic families',
		options: [
			{ label: 'System UI', value: 'system-ui' },
			{ label: 'Sans-serif', value: 'sans-serif' },
			{ label: 'Serif', value: 'serif' },
			{ label: 'Monospace', value: 'monospace' },
			{ label: 'Cursive', value: 'cursive' },
			{ label: 'Fantasy', value: 'fantasy' },
		],
	},
];

const fontFamilyOptions: FontOption[] = fontFamilyGroups.flatMap((group) => group.options);

const FONT_SCALE = { min: 0.75, max: 1.5, step: 0.05 } as const;
const HEADING_SCALE = { min: 0.5, max: 2.5, step: 0.05 } as const;

/**
 * Heading sizes in the order they appear on the page, with the element each renders by default.
 */
const headingScales: { key: HeadingScaleKey; size: string; level: string }[] = [
	{ key: 'dynamicFontHeadingXxlargeScale', size: 'xxlarge', level: 'H1' },
	{ key: 'dynamicFontHeadingXlargeScale', size: 'xlarge', level: 'H2' },
	{ key: 'dynamicFontHeadingLargeScale', size: 'large', level: 'H3' },
	{ key: 'dynamicFontHeadingMediumScale', size: 'medium', level: 'H4' },
	{ key: 'dynamicFontHeadingSmallScale', size: 'small', level: 'H5' },
	{ key: 'dynamicFontHeadingXsmallScale', size: 'xsmall', level: 'H6' },
	{ key: 'dynamicFontHeadingXxsmallScale', size: 'xxsmall', level: 'H6' },
];

const DEFAULT_TYPOGRAPHY: TypographyOverrides = {
	dynamicFontFamily: DEFAULT_FONT_FAMILY,
	dynamicFontScale: 1,
	dynamicFontHeadingXxlargeScale: 1,
	dynamicFontHeadingXlargeScale: 1,
	dynamicFontHeadingLargeScale: 1,
	dynamicFontHeadingMediumScale: 1,
	dynamicFontHeadingSmallScale: 1,
	dynamicFontHeadingXsmallScale: 1,
	dynamicFontHeadingXxsmallScale: 1,
};

type Preset = { name: string; description: string; typography: TypographyOverrides };

const presets: Preset[] = [
	{
		name: 'Editorial serif',
		description: 'Georgia with an oversized headline',
		typography: {
			...DEFAULT_TYPOGRAPHY,
			dynamicFontFamily: 'Georgia, serif',
			dynamicFontScale: 1.05,
			dynamicFontHeadingXxlargeScale: 1.6,
			dynamicFontHeadingXlargeScale: 1.25,
			dynamicFontHeadingLargeScale: 1.1,
		},
	},
	{
		name: 'Swiss grotesk',
		description: 'Helvetica with a poster-sized headline',
		typography: {
			...DEFAULT_TYPOGRAPHY,
			dynamicFontFamily: 'Helvetica, Arial, sans-serif',
			dynamicFontHeadingXxlargeScale: 2,
			dynamicFontHeadingXlargeScale: 1.35,
			dynamicFontHeadingLargeScale: 1.05,
			dynamicFontHeadingSmallScale: 0.95,
			dynamicFontHeadingXsmallScale: 0.95,
		},
	},
	{
		name: 'Terminal mono',
		description: 'Courier New set tight and even',
		typography: {
			...DEFAULT_TYPOGRAPHY,
			dynamicFontFamily: '"Courier New", Courier, monospace',
			dynamicFontScale: 0.95,
			dynamicFontHeadingXxlargeScale: 1.2,
			dynamicFontHeadingXlargeScale: 1.1,
		},
	},
];

const isSameTypography = (a: TypographyOverrides, b: TypographyOverrides) =>
	(Object.keys(a) as (keyof TypographyOverrides)[]).every((key) => a[key] === b[key]);

const toPercentage = (scale: number) => `${Math.round(scale * 100)}%`;

const presetStyles = cssMap({
	grid: {
		gridTemplateColumns: 'repeat(3, minmax(0, 1fr))',
	},
	tile: {
		width: '100%',
		height: '100%',
		paddingBlock: token('space.150'),
		paddingInline: token('space.150'),
		borderRadius: token('radius.medium'),
		borderWidth: token('border.width'),
		borderStyle: 'solid',
		borderColor: token('color.border'),
		backgroundColor: token('elevation.surface'),
		textAlign: 'start',
		'&:hover': {
			backgroundColor: token('elevation.surface.hovered'),
		},
		'&:active': {
			backgroundColor: token('elevation.surface.pressed'),
		},
	},
	selected: {
		borderColor: token('color.border.selected'),
		backgroundColor: token('color.background.selected'),
		'&:hover': {
			backgroundColor: token('color.background.selected.hovered'),
		},
		'&:active': {
			backgroundColor: token('color.background.selected.pressed'),
		},
	},
});

/**
 * Renders `children` with the given typography applied, following the parent provider's colour
 * mode.
 */
function TypographyScope({
	typography,
	children,
}: {
	typography: TypographyOverrides;
	children: React.ReactNode;
}) {
	// Called outside the nested provider below, so this is the parent's colour mode.
	const colorMode = useColorMode();

	return (
		<ThemeProvider
			defaultColorMode={colorMode}
			defaultTheme={{
				typography: { id: 'UNSAFE-typography', overrides: typography },
			}}
		>
			{/* `defaultColorMode` is only read on mount, so keep following the parent's mode. */}
			<SyncColorMode colorMode={colorMode} />
			{children}
		</ThemeProvider>
	);
}

function PresetTile({
	preset,
	isSelected,
	onSelect,
}: {
	preset: Preset;
	isSelected: boolean;
	onSelect: () => void;
}) {
	return (
		<Pressable
			xcss={cx(presetStyles.tile, isSelected && presetStyles.selected)}
			aria-pressed={isSelected}
			onClick={onSelect}
		>
			{/* The preview renders in the preset's own typography. */}
			<TypographyScope typography={preset.typography}>
				<Stack space="space.100">
					<span aria-hidden>
						<Heading as="div" size="xlarge">
							Aa
						</Heading>
					</span>
					<Stack space="space.025">
						<Text weight="semibold">{preset.name}</Text>
						<Text size="small" color="color.text.subtle">
							{preset.description}
						</Text>
					</Stack>
				</Stack>
			</TypographyScope>
		</Pressable>
	);
}

function ScaleSlider({
	id,
	label,
	value,
	min,
	max,
	step,
	onChange,
}: {
	id: string;
	label: string;
	value: number;
	min: number;
	max: number;
	step: number;
	onChange: (value: number) => void;
}) {
	return (
		<Stack space="space.050">
			<Inline spread="space-between" alignBlock="center">
				<Label htmlFor={id}>{label}</Label>
				<Text size="small" color="color.text.subtle">
					{toPercentage(value)}
				</Text>
			</Inline>
			<Range id={id} min={min} max={max} step={step} value={value} onChange={onChange} />
		</Stack>
	);
}

function TypographyControls({
	values,
	onChange,
}: {
	values: TypographyOverrides;
	onChange: (values: TypographyOverrides) => void;
}) {
	const selectedFont =
		fontFamilyOptions.find((option) => option.value === values.dynamicFontFamily) ?? null;

	return (
		<Stack space="space.400">
			<Stack space="space.150">
				<Inline spread="space-between" alignBlock="center">
					<Heading as="h3" size="xsmall">
						Presets
					</Heading>
					<Button
						appearance="subtle"
						spacing="compact"
						onClick={() => onChange(DEFAULT_TYPOGRAPHY)}
					>
						Reset
					</Button>
				</Inline>
				<Grid gap="space.100" xcss={presetStyles.grid}>
					{presets.map((preset) => (
						<PresetTile
							key={preset.name}
							preset={preset}
							isSelected={isSameTypography(values, preset.typography)}
							onSelect={() => onChange(preset.typography)}
						/>
					))}
				</Grid>
			</Stack>

			<Stack space="space.200">
				<Heading as="h3" size="xsmall">
					Font
				</Heading>
				<Stack space="space.050">
					<Label htmlFor="editorial-font-family">Font family</Label>
					<Select<FontOption>
						inputId="editorial-font-family"
						options={fontFamilyGroups}
						value={selectedFont}
						onChange={(option) => {
							if (option) {
								onChange({ ...values, dynamicFontFamily: option.value });
							}
						}}
					/>
				</Stack>
				<ScaleSlider
					id="editorial-font-size"
					label="Font size"
					value={values.dynamicFontScale}
					{...FONT_SCALE}
					onChange={(value) => onChange({ ...values, dynamicFontScale: value })}
				/>
			</Stack>

			<Stack space="space.200">
				<Stack space="space.050">
					<Heading as="h3" size="xsmall">
						Heading sizes
					</Heading>
					<Text size="small" color="color.text.subtle">
						Each heading is scaled on top of the font size above.
					</Text>
				</Stack>
				{headingScales.map(({ key, size, level }) => (
					<ScaleSlider
						key={key}
						id={`editorial-heading-${size}`}
						label={`${level} · ${size}`}
						value={values[key]}
						{...HEADING_SCALE}
						onChange={(value) => onChange({ ...values, [key]: value })}
					/>
				))}
			</Stack>
		</Stack>
	);
}

export default function CustomThemeEditorialBriefExample(): React.JSX.Element {
	const [typographyOverrides, setTypographyOverrides] =
		useState<TypographyOverrides>(DEFAULT_TYPOGRAPHY);

	return (
		<CustomThemeShowcase
			panelTitle="Typography variables"
			panelWidth={420}
			controls={
				<TypographyControls values={typographyOverrides} onChange={setTypographyOverrides} />
			}
		>
			{/* Scope the typography theme to the article so the controls panel stays stable. */}
			<TypographyScope typography={typographyOverrides}>
				<EditorialBrief />
			</TypographyScope>
		</CustomThemeShowcase>
	);
}

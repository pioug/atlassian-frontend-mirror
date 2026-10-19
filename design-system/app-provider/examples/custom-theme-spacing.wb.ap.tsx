/**
 * @jsxRuntime classic
 * @jsx jsx
 */
import React, { useEffect, useRef, useState } from 'react';

import { ThemeProvider } from '@atlaskit/app-provider/theme-provider';
import Button from '@atlaskit/button/default/button';
import { Checkbox } from '@atlaskit/checkbox/checkbox';
import { cssMap, cx, jsx } from '@atlaskit/css';
import { Label } from '@atlaskit/form/label/default';
import Heading from '@atlaskit/heading/heading';
import { Box } from '@atlaskit/primitives/compiled/box';
import { Grid } from '@atlaskit/primitives/compiled/grid';
import { Inline } from '@atlaskit/primitives/compiled/inline';
import { Pressable } from '@atlaskit/primitives/compiled/pressable';
import { Stack } from '@atlaskit/primitives/compiled/stack';
import { Text } from '@atlaskit/primitives/compiled/text';
import Range from '@atlaskit/range/range';
import Select from '@atlaskit/select/default';
import { token } from '@atlaskit/tokens';
import useThemeObserver from '@atlaskit/tokens/use-theme-observer';

import { SyncColorMode } from './shared/custom-theme-showcase';
import { DashboardLayout } from './shared/dashboard-layout';
import { EditorialBrief } from './shared/editorial-brief';
import { SettingsLayout } from './shared/settings-layout';
import { SpacingInspector } from './shared/spacing-inspector/spacing-inspector';

const toPercentage = (value: number) => `${Math.round(value * 100)}%`;

const GAP_SCALE = { min: 0.3, max: 3, step: 0.05 } as const;

const gapTokens = [
	{ name: 'xxsmall', size: 2 },
	{ name: 'xsmall', size: 4 },
	{ name: 'small', size: 6 },
	{ name: 'medium', size: 8 },
	{ name: 'large', size: 12 },
	{ name: 'xlarge', size: 16 },
	{ name: 'xxlarge', size: 24 },
] as const;

type GapName = (typeof gapTokens)[number]['name'];
type GapSettings = {
	scale: number;
	uniformity: number;
	curve: number;
	round: boolean;
	overrides: Partial<Record<GapName, number>>;
};

const DEFAULT_GAPS: GapSettings = {
	scale: 1,
	uniformity: 0,
	curve: 1,
	round: true,
	overrides: {},
};

const formatPixels = (value: number) => `${Number(value.toFixed(2))}px`;

function getGapInfluence(size: number, settings: GapSettings): number {
	const position = (size - 2) / (24 - 2);
	return settings.uniformity + (1 - settings.uniformity) * position ** settings.curve;
}

function getGapValues(settings: GapSettings): Record<GapName, number> {
	const values = {} as Record<GapName, number>;
	let previous = 0;

	for (const { name, size } of gapTokens) {
		const exponent = getGapInfluence(size, settings);
		// Strong curves and rounding may bring adjacent sizes together, but must not reverse them.
		const value = Math.max(previous, size * settings.scale ** exponent);
		previous = value;
		// Apply the same rounding to automatic values and independent manual overrides.
		const effectiveValue = settings.overrides[name] ?? value;
		values[name] = settings.round ? Math.round(effectiveValue) : effectiveValue;
	}
	return values;
}

const gapPresets: { name: string; description: string; settings: GapSettings }[] = [
	{
		name: 'Compact',
		description: 'Close throughout',
		settings: { scale: 0.65, uniformity: 0.6, curve: 0.75, round: true, overrides: {} },
	},
	{
		name: 'Default',
		description: 'Original rhythm',
		settings: DEFAULT_GAPS,
	},
	{
		name: 'Comfortable',
		description: 'Gentle expansion',
		settings: { scale: 1.5, uniformity: 0.3, curve: 1.5, round: true, overrides: {} },
	},
	{
		name: 'Spacious',
		description: 'Larger section breaks',
		settings: { scale: 2, uniformity: 0.1, curve: 2, round: true, overrides: {} },
	},
	{
		name: 'Fluid',
		description: 'Fractional spacing',
		settings: { scale: 1.25, uniformity: 0.7, curve: 0.5, round: false, overrides: {} },
	},
];

const gapChartStyles = cssMap({
	container: { width: '100%', minWidth: 0 },
	chart: { display: 'block', width: '100%', font: token('font.body.small') },
	label: { fill: token('color.text.subtle') },
	grid: { stroke: token('color.border'), strokeWidth: 1 },
	current: { fill: 'none', stroke: token('color.chart.brand'), strokeWidth: 2 },
	original: {
		fill: 'none',
		stroke: token('color.chart.categorical.2'),
		strokeWidth: 2,
		strokeDasharray: '2 3',
	},
	point: { fill: token('color.chart.brand') },
});

const presetStyles = cssMap({
	grid: {
		gridTemplateColumns: 'repeat(3, minmax(0, 1fr))',
	},
	gapPreviewHeading: { fill: token('color.text') },
	gapPreviewText: { fill: token('color.text.subtlest') },
	gapPreview: { maxWidth: '100%', height: 'auto' },
	gapTile: { display: 'flex', alignItems: 'start' },
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

function ScaleSlider({
	id,
	label,
	value,
	min,
	max,
	step,
	onChange,
	formatValue = toPercentage,
}: {
	id: string;
	label: string;
	value: number;
	min: number;
	max: number;
	step: number;
	onChange: (value: number) => void;
	formatValue?: (value: number) => string;
}) {
	return (
		<Stack space="space.gap.xsmall">
			<Inline spread="space-between" alignBlock="center">
				<Label htmlFor={id}>{label}</Label>
				<Text size="small" color="color.text.subtle">
					{formatValue(value)}
				</Text>
			</Inline>
			<Range id={id} min={min} max={max} step={step} value={value} onChange={onChange} />
		</Stack>
	);
}

function GapResponseChart({ values }: { values: Record<GapName, number> }) {
	const [width, setWidth] = useState(320);
	const containerRef = useRef<HTMLDivElement>(null);

	useEffect(() => {
		const container = containerRef.current;
		if (!container) {
			return;
		}
		const observer = new ResizeObserver(([entry]) => setWidth(entry.contentRect.width));
		observer.observe(container);
		return () => observer.disconnect();
	}, []);

	const height = 240;
	const left = 48;
	const right = width - 14;
	const top = 30;
	const bottom = 192;
	const maximum = Math.ceil(Math.max(24, ...Object.values(values)) / 8) * 8;
	const x = (size: number) => left + 6 + ((size - 2) / 22) * (right - left - 12);
	const y = (value: number) => bottom - 6 - (value / maximum) * (bottom - top - 12);
	const current = gapTokens.map(({ name, size }) => ({ size, value: values[name] }));
	const original = gapTokens.map(({ size }) => ({ size, value: size }));
	const path = (points: { size: number; value: number }[]) =>
		points
			.map((point, index) => `${index ? 'L' : 'M'}${x(point.size)},${y(point.value)}`)
			.join(' ');

	return (
		<Stack space="space.gap.medium">
			<Heading as="h3" size="xsmall">
				Gap sizes
			</Heading>
			<Inline space="space.gap.large" shouldWrap>
				<Inline space="space.gap.xsmall" alignBlock="center">
					<svg width="20" height="10" aria-hidden="true">
						<path d="M0 5H20" css={gapChartStyles.current} />
					</svg>
					<Text size="small">Current settings</Text>
				</Inline>
				<Inline space="space.gap.xsmall" alignBlock="center">
					<svg width="20" height="10" aria-hidden="true">
						<path d="M0 5H20" css={gapChartStyles.original} />
					</svg>
					<Text size="small">Original</Text>
				</Inline>
			</Inline>
			<div ref={containerRef} css={gapChartStyles.container}>
				{/* eslint-disable-next-line @atlaskit/design-system/no-html-image -- Live chart requires SVG paths and dynamic coordinates. */}
				<svg
					width="100%"
					height={height}
					viewBox={`0 0 ${width} ${height}`}
					css={gapChartStyles.chart}
					role="img"
					aria-label={`Applied gap sizes: ${gapTokens.map(({ name }) => `${name} ${formatPixels(values[name])}`).join(', ')}`}
				>
					<text x={left} y={16} css={gapChartStyles.label}>
						Resulting gap (px)
					</text>
					{[0, maximum / 2, maximum].map((value) => (
						<g key={value}>
							<line x1={left} x2={right} y1={y(value)} y2={y(value)} css={gapChartStyles.grid} />
							<text
								x={left - 8}
								y={y(value)}
								dy="0.35em"
								textAnchor="end"
								css={gapChartStyles.label}
							>
								{value}
							</text>
						</g>
					))}
					{[2, 8, 16, 24].map((size) => (
						<text
							key={size}
							x={x(size)}
							y={bottom + 16}
							textAnchor="middle"
							css={gapChartStyles.label}
						>
							{size}
						</text>
					))}
					<text
						x={(left + right) / 2}
						y={height - 8}
						textAnchor="middle"
						css={gapChartStyles.label}
					>
						Original gap (px)
					</text>
					<path
						d={path(current)}
						css={gapChartStyles.current}
						data-testid="gap-spacing-response-curve"
					/>
					<path
						d={path(original)}
						css={gapChartStyles.original}
						data-testid="gap-spacing-original-curve"
					/>
					{gapTokens.map(({ name, size }) => (
						<circle key={name} cx={x(size)} cy={y(values[name])} r={3} css={gapChartStyles.point}>
							<title>{`space.gap.${name}: ${formatPixels(values[name])}`}</title>
						</circle>
					))}
				</svg>
			</div>
		</Stack>
	);
}

function GapPresetTile({
	preset,
	isSelected,
	onSelect,
}: {
	preset: (typeof gapPresets)[number];
	isSelected: boolean;
	onSelect: () => void;
}) {
	const gaps = getGapValues(preset.settings);
	const previewHeight = 3 * (20 + gaps.medium) + 2 * gaps.xxlarge;
	return (
		<Pressable
			xcss={cx(presetStyles.tile, presetStyles.gapTile, isSelected && presetStyles.selected)}
			aria-pressed={isSelected}
			onClick={onSelect}
		>
			<Stack space="space.gap.medium">
				<svg
					width="72"
					height={previewHeight * 0.75}
					viewBox={`0 0 96 ${previewHeight}`}
					preserveAspectRatio="xMinYMin meet"
					aria-hidden="true"
					css={presetStyles.gapPreview}
				>
					{/* Keep the content and scale identical so only each preset's gaps change. */}
					{[0, 1, 2].map((sectionIndex) => (
						<g
							key={sectionIndex}
							transform={`translate(0 ${sectionIndex * (20 + gaps.medium + gaps.xxlarge)})`}
						>
							<rect width={62} height={5} rx={1} css={presetStyles.gapPreviewHeading} />
							{[0, 1, 2].map((lineIndex) => (
								<rect
									key={lineIndex}
									y={5 + gaps.medium + lineIndex * 6}
									width={lineIndex === 2 ? 69 : 96}
									height={3}
									rx={1}
									css={presetStyles.gapPreviewText}
								/>
							))}
						</g>
					))}
				</svg>
				<Stack space="space.gap.xxsmall">
					<Text weight="semibold">{preset.name}</Text>
					<Text size="small" color="color.text.subtle">
						{preset.description}
					</Text>
				</Stack>
			</Stack>
		</Pressable>
	);
}

function GapControls({
	settings,
	values,
	onChange,
	onInspect,
}: {
	settings: GapSettings;
	values: Record<GapName, number>;
	onChange: (settings: GapSettings) => void;
	onInspect: (token: string | null) => void;
}) {
	// General controls recalculate every gap; individual edits explicitly retain other overrides.
	const update = (changes: Partial<GapSettings>) =>
		onChange({ ...settings, overrides: {}, ...changes });
	const selectedPreset = gapPresets.find(
		(preset) =>
			settings.scale === preset.settings.scale &&
			settings.uniformity === preset.settings.uniformity &&
			settings.curve === preset.settings.curve &&
			settings.round === preset.settings.round &&
			Object.keys(settings.overrides).length === 0,
	);
	return (
		<Stack role="region" aria-label="Spacing" space="space.400">
			<Stack space="space.gap.large">
				<Inline spread="space-between" alignBlock="center">
					<Heading as="h3" size="xsmall">
						Presets
					</Heading>
					<Button
						appearance="subtle"
						spacing="compact"
						aria-label="Reset spacing"
						onClick={() => onChange(DEFAULT_GAPS)}
					>
						Reset
					</Button>
				</Inline>
				<Grid gap="space.gap.medium" xcss={presetStyles.grid}>
					{gapPresets.map((preset) => (
						<GapPresetTile
							key={preset.name}
							preset={preset}
							isSelected={selectedPreset === preset}
							onSelect={() => onChange(preset.settings)}
						/>
					))}
				</Grid>
			</Stack>

			<GapResponseChart values={values} />

			<Stack space="space.gap.xlarge">
				<Heading as="h3" size="xsmall">
					Scale
				</Heading>
				<ScaleSlider
					id="gap-spacing-spacing"
					label="Gap scale"
					value={settings.scale}
					{...GAP_SCALE}
					onChange={(scale) => update({ scale })}
				/>
				<Stack space="space.gap.xsmall">
					<ScaleSlider
						id="gap-spacing-uniformity"
						label="Scale uniformity"
						value={settings.uniformity}
						min={0}
						max={1}
						step={0.1}
						onChange={(uniformity) => update({ uniformity })}
					/>
					<Text size="small" color="color.text.subtle">
						At 0%, the smallest gaps change gently. At 100%, all gaps scale evenly. The 2px gap
						stays fixed at 0% uniformity.
					</Text>
				</Stack>
				<Stack space="space.gap.xsmall">
					<ScaleSlider
						id="gap-spacing-curve"
						label="Curve strength"
						value={settings.curve}
						min={0.25}
						max={3}
						step={0.25}
						formatValue={(value) => `${value}×`}
						onChange={(curve) => update({ curve })}
					/>
					<Text size="small" color="color.text.subtle">
						Above 1×, changes concentrate in larger gaps. Below 1×, medium gaps respond more. Curve
						strength has no effect at 100% uniformity.
					</Text>
				</Stack>
				<Checkbox
					id="gap-spacing-rounding"
					label="Round gap values"
					isChecked={settings.round}
					onChange={(event) => update({ round: event.target.checked })}
				/>
				<Text size="small" color="color.text.subtle">
					Automatic values stay ordered; stronger curves or rounding can make adjacent sizes equal.
				</Text>
			</Stack>

			<Stack space="space.gap.xlarge">
				<Stack space="space.gap.xsmall">
					<Heading as="h3" size="xsmall">
						Individual gaps
					</Heading>
					<Text size="small" color="color.text.subtle">
						Adjust any gap independently. Changing a general spacing control recalculates all gaps
						and clears individual adjustments.
					</Text>
				</Stack>
				{gapTokens.map(({ name }) => (
					<div
						key={name}
						onMouseEnter={() => onInspect(`space.gap.${name}`)}
						onMouseLeave={(event) =>
							!event.currentTarget.matches(':focus-within') && onInspect(null)
						}
						onFocus={() => onInspect(`space.gap.${name}`)}
						onBlur={(event) =>
							!event.currentTarget.contains(event.relatedTarget as Node | null) && onInspect(null)
						}
					>
						<ScaleSlider
							id={`gap-spacing-${name}`}
							label={name}
							value={values[name]}
							min={0}
							max={24 * GAP_SCALE.max}
							step={settings.round ? 1 : 0.01}
							formatValue={formatPixels}
							onChange={(value) => update({ overrides: { ...settings.overrides, [name]: value } })}
						/>
					</div>
				))}
			</Stack>
		</Stack>
	);
}

const layoutOptions = [
	{ label: 'Article', value: 'article' },
	{ label: 'Dashboard', value: 'dashboard' },
	{ label: 'Settings', value: 'settings' },
] as const;
type Layout = (typeof layoutOptions)[number]['value'];

const previewStyles = cssMap({
	page: {
		gridTemplateColumns: 'minmax(0, 1fr)',
		alignItems: 'start',
		'@media (min-width: 64rem)': {
			gridTemplateColumns: 'minmax(0, 1fr) 420px',
		},
	},
	main: {
		minWidth: 0,
		'@media (min-width: 64rem)': {
			position: 'sticky',
			insetBlockStart: 0,
			maxHeight: '100vh',
			overflowY: 'auto',
		},
	},
	controls: { minWidth: 0 },
	root: {
		minWidth: 0,
		width: '100%',
		maxWidth: '960px',
		marginInline: 'auto',
	},
});

export default function CustomThemeSpacingExample(): React.JSX.Element {
	const { colorMode } = useThemeObserver();
	const [layout, setLayout] = useState<Layout>('article');
	const [gapSettings, setGapSettings] = useState<GapSettings>(DEFAULT_GAPS);
	const [showGaps, setShowGaps] = useState(false);
	const [activeToken, setActiveToken] = useState<string | null>(null);
	const gapValues = getGapValues(gapSettings);
	// Only the preview inherits these overrides; controls retain their original spacing.
	const gapStyles: React.CSSProperties & Record<`--ds-space-gap-${string}`, string> = {
		'--ds-space-gap-xxsmall': `calc(${token('space.025')} * ${gapValues.xxsmall / 2})`,
		'--ds-space-gap-xsmall': `calc(${token('space.050')} * ${gapValues.xsmall / 4})`,
		'--ds-space-gap-small': `calc(${token('space.075')} * ${gapValues.small / 6})`,
		'--ds-space-gap-medium': `calc(${token('space.100')} * ${gapValues.medium / 8})`,
		'--ds-space-gap-large': `calc(${token('space.150')} * ${gapValues.large / 12})`,
		'--ds-space-gap-xlarge': `calc(${token('space.200')} * ${gapValues.xlarge / 16})`,
		'--ds-space-gap-xxlarge': `calc(${token('space.300')} * ${gapValues.xxlarge / 24})`,
	};

	return (
		<ThemeProvider defaultColorMode={colorMode}>
			<SyncColorMode colorMode={colorMode} />
			<Grid xcss={previewStyles.page}>
				<Box as="main" padding="space.400" xcss={previewStyles.main}>
					<Stack space="space.300">
						<SpacingInspector enabled={showGaps} activeToken={activeToken}>
							<Box style={gapStyles} xcss={previewStyles.root} testId="gap-spacing-preview">
								{layout === 'article' && <EditorialBrief />}
								{layout === 'dashboard' && <DashboardLayout />}
								{layout === 'settings' && <SettingsLayout />}
							</Box>
						</SpacingInspector>
					</Stack>
				</Box>
				<Box
					as="aside"
					aria-label="Spacing variables"
					padding="space.300"
					backgroundColor="elevation.surface.sunken"
					xcss={previewStyles.controls}
				>
					<Stack space="space.400">
						<Stack space="space.gap.xlarge">
							<Heading as="h2" size="small">
								Layout settings
							</Heading>
							<Stack space="space.gap.xsmall">
								<Label htmlFor="gap-spacing-layout">Layout type</Label>
								<Select
									inputId="gap-spacing-layout"
									options={layoutOptions}
									value={layoutOptions.find((option) => option.value === layout)}
									onChange={(option) => option && setLayout(option.value)}
									isSearchable={false}
								/>
							</Stack>
							<Stack space="space.gap.xsmall">
								<Checkbox
									label="Show gaps"
									aria-describedby="gap-spacing-overlay-description"
									isChecked={showGaps}
									onChange={(event) => setShowGaps(event.target.checked)}
								/>
								<Text id="gap-spacing-overlay-description" size="small" color="color.text.subtle">
									Highlight gaps between elements. Hover a gap to see its token and size, or focus a
									gap slider to highlight its uses.
								</Text>
							</Stack>
						</Stack>
						<Heading as="h2" size="small">
							Spacing variables
						</Heading>
						<GapControls
							settings={gapSettings}
							values={gapValues}
							onChange={setGapSettings}
							onInspect={setActiveToken}
						/>
					</Stack>
				</Box>
			</Grid>
		</ThemeProvider>
	);
}

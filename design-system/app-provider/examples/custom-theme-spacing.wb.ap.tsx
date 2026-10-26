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
import Tab from '@atlaskit/tabs/tab';
import TabList from '@atlaskit/tabs/tab-list';
import TabPanel from '@atlaskit/tabs/tab-panel';
import Tabs from '@atlaskit/tabs/tabs';
import Toggle from '@atlaskit/toggle/toggle';
import { token } from '@atlaskit/tokens';
import useThemeObserver from '@atlaskit/tokens/use-theme-observer';
import Tooltip from '@atlaskit/tooltip/Tooltip';

import { ChatLayout } from './shared/chat-layout';
import { SyncColorMode } from './shared/custom-theme-showcase';
import { DashboardLayout } from './shared/dashboard-layout';
import { EditorialBrief } from './shared/editorial-brief';
import { SettingsLayout } from './shared/settings-layout';
import { SpacingInspector } from './shared/spacing-inspector/spacing-inspector';
import { SpacingSwatch } from './shared/spacing-inspector/spacing-pattern';

const toPercentage = (value: number) => `${Math.round(value * 100)}%`;

const SPACING_SCALE = { min: 0.3, max: 3, step: 0.05 } as const;

const spacingTokens = {
	gap: [
		{ name: 'xxsmall', size: 2 },
		{ name: 'xsmall', size: 4 },
		{ name: 'small', size: 6 },
		{ name: 'medium', size: 8 },
		{ name: 'large', size: 12 },
		{ name: 'xlarge', size: 16 },
		{ name: 'xxlarge', size: 24 },
	],
	inset: [
		{ name: 'xxsmall', size: 4 },
		{ name: 'xsmall', size: 8 },
		{ name: 'small', size: 12 },
		{ name: 'medium', size: 16 },
		{ name: 'large', size: 20 },
		{ name: 'xlarge', size: 24 },
		{ name: 'xxlarge', size: 32 },
		{ name: '3xlarge', size: 48 },
	],
} as const;

type SpacingKind = keyof typeof spacingTokens;
type SpacingName = (typeof spacingTokens)[SpacingKind][number]['name'];
const spacingLabels = {
	gap: { singular: 'gap', plural: 'gaps', title: 'Gap' },
	inset: { singular: 'inset', plural: 'insets', title: 'Inset' },
} as const;

type SpacingSettings = {
	scale: number;
	uniformity: number;
	curve: number;
	round: boolean;
};

const DEFAULT_SPACING: SpacingSettings = {
	scale: 1,
	uniformity: 0,
	curve: 1,
	round: true,
};

const formatPixels = (value: number) => `${Number(value.toFixed(2))}px`;

function getSpacingValues(
	kind: SpacingKind,
	settings: SpacingSettings,
): Record<SpacingName, number> {
	const tokens = spacingTokens[kind];
	const smallest = tokens[0].size;
	const largest = tokens[tokens.length - 1].size;
	const values = {} as Record<SpacingName, number>;
	let previous = 0;

	for (const { name, size } of tokens) {
		const position = (size - smallest) / (largest - smallest);
		const exponent = settings.uniformity + (1 - settings.uniformity) * position ** settings.curve;
		// Strong curves and rounding may bring adjacent sizes together, but must not reverse them.
		const value = Math.max(previous, size * settings.scale ** exponent);
		previous = value;
		values[name] = settings.round ? Math.round(value) : value;
	}
	return values;
}

const spacingPresets: { name: string; description: string; settings: SpacingSettings }[] = [
	{
		name: 'Compact',
		description: 'Close throughout',
		settings: { scale: 0.65, uniformity: 0.6, curve: 0.75, round: true },
	},
	{
		name: 'Default',
		description: 'Original rhythm',
		settings: DEFAULT_SPACING,
	},
	{
		name: 'Comfortable',
		description: 'Gentle expansion',
		settings: { scale: 1.5, uniformity: 0.3, curve: 1.5, round: true },
	},
	{
		name: 'Spacious',
		description: 'Generous spacing',
		settings: { scale: 2, uniformity: 0.1, curve: 2, round: true },
	},
	{
		name: 'Fluid',
		description: 'Fractional spacing',
		settings: { scale: 1.25, uniformity: 0.7, curve: 0.5, round: false },
	},
];

const chartStyles = cssMap({
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
	pointTarget: {
		fill: 'transparent',
		stroke: 'transparent',
		strokeWidth: 2,
		'&:focus-visible': { stroke: token('color.border.focused') },
	},
});

const presetStyles = cssMap({
	grid: {
		gridTemplateColumns: 'repeat(3, minmax(0, 1fr))',
	},
	previewHeading: { fill: token('color.text') },
	previewText: { fill: token('color.text.subtlest') },
	insetSurface: {
		fill: token('color.background.selected'),
		stroke: token('color.border.selected'),
	},
	insetContent: { fill: token('elevation.surface') },
	preview: { maxWidth: '100%', height: 'auto' },
	previewTile: { display: 'flex', alignItems: 'start' },
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
			<Inline spread="space-between" alignBlock="center" space="space.gap.small" shouldWrap>
				<Label htmlFor={id}>{label}</Label>
				<Text size="small" color="color.text.subtle">
					{formatValue(value)}
				</Text>
			</Inline>
			<Range
				id={id}
				type="range"
				min={min}
				max={max}
				step={step}
				value={value}
				aria-valuetext={formatValue(value)}
				onChange={onChange}
			/>
		</Stack>
	);
}

function SpacingResponseChart({
	kind,
	values,
	onInspect,
}: {
	kind: SpacingKind;
	values: Record<SpacingName, number>;
	onInspect?: (token: string | null) => void;
}) {
	const tokens = spacingTokens[kind];
	const labels = spacingLabels[kind];
	const smallest = tokens[0].size;
	const largest = tokens[tokens.length - 1].size;
	const [width, setWidth] = useState(320);
	const [hoveredPoint, setHoveredPoint] = useState<SpacingName | null>(null);
	const [focusedPoint, setFocusedPoint] = useState<SpacingName | null>(null);
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
	const maximum = Math.ceil(Math.max(largest, ...Object.values(values)) / 8) * 8;
	const x = (size: number) =>
		left + 6 + ((size - smallest) / (largest - smallest)) * (right - left - 12);
	const y = (value: number) => bottom - 6 - (value / maximum) * (bottom - top - 12);
	const current = tokens.map(({ name, size }) => ({ size, value: values[name] }));
	const original = tokens.map(({ size }) => ({ size, value: size }));
	const path = (points: { size: number; value: number }[]) =>
		points
			.map((point, index) => `${index ? 'L' : 'M'}${x(point.size)},${y(point.value)}`)
			.join(' ');

	return (
		<Stack space="space.gap.medium">
			<Heading as="h3" size="xsmall">
				{labels.title} sizes
			</Heading>
			<Inline space="space.gap.large" shouldWrap>
				<Inline space="space.gap.xsmall" alignBlock="center">
					<svg width="20" height="10" aria-hidden="true">
						<path d="M0 5H20" css={chartStyles.current} />
					</svg>
					<Text size="small">Current settings</Text>
				</Inline>
				<Inline space="space.gap.xsmall" alignBlock="center">
					<svg width="20" height="10" aria-hidden="true">
						<path d="M0 5H20" css={chartStyles.original} />
					</svg>
					<Text size="small">Original</Text>
				</Inline>
			</Inline>
			<div ref={containerRef} css={chartStyles.container}>
				{/* eslint-disable-next-line @atlaskit/design-system/no-html-image -- Live chart requires SVG paths and dynamic coordinates. */}
				<svg
					width="100%"
					height={height}
					viewBox={`0 0 ${width} ${height}`}
					css={chartStyles.chart}
					role="group"
					aria-label={`Applied ${labels.singular} sizes: ${tokens.map(({ name }) => `${name} ${formatPixels(values[name])}`).join(', ')}`}
				>
					<text x={left} y={16} css={chartStyles.label}>
						Resulting {labels.singular} (px)
					</text>
					{[0, maximum / 2, maximum].map((value) => (
						<g key={value}>
							<line x1={left} x2={right} y1={y(value)} y2={y(value)} css={chartStyles.grid} />
							<text x={left - 8} y={y(value)} dy="0.35em" textAnchor="end" css={chartStyles.label}>
								{value}
							</text>
						</g>
					))}
					{[smallest, tokens[3].size, tokens[5].size, largest].map((size) => (
						<text
							key={size}
							x={x(size)}
							y={bottom + 16}
							textAnchor="middle"
							css={chartStyles.label}
						>
							{size}
						</text>
					))}
					<text x={(left + right) / 2} y={height - 8} textAnchor="middle" css={chartStyles.label}>
						Original {labels.singular} (px)
					</text>
					<path
						d={path(current)}
						css={chartStyles.current}
						data-testid={`${kind}-spacing-response-curve`}
					/>
					<path
						d={path(original)}
						css={chartStyles.original}
						data-testid={`${kind}-spacing-original-curve`}
					/>
					{tokens.map(({ name, size }) => (
						<Tooltip
							key={name}
							tag="g"
							content={`space.${kind}.${name}: ${formatPixels(values[name])}`}
							position="top"
							delay={0}
							isScreenReaderAnnouncementDisabled
						>
							<circle
								cx={x(size)}
								cy={y(values[name])}
								r={12}
								css={chartStyles.pointTarget}
								role="button"
								tabIndex={0}
								aria-label={`space.${kind}.${name}: ${formatPixels(values[name])}`}
								onClick={() => onInspect?.(`space.${kind}.${name}`)}
								onKeyDown={(event) => {
									if (event.key === 'Enter' || event.key === ' ') {
										event.preventDefault();
										onInspect?.(`space.${kind}.${name}`);
									}
								}}
								onMouseEnter={() => {
									setHoveredPoint(name);
									onInspect?.(`space.${kind}.${name}`);
								}}
								onMouseLeave={(event) => {
									setHoveredPoint(null);
									!event.currentTarget.matches(':focus') && onInspect?.(null);
								}}
								onFocus={() => {
									setFocusedPoint(name);
									onInspect?.(`space.${kind}.${name}`);
								}}
								onBlur={() => {
									setFocusedPoint(null);
									onInspect?.(null);
								}}
							/>
							<circle
								cx={x(size)}
								cy={y(values[name])}
								r={hoveredPoint === name || focusedPoint === name ? 5 : 3}
								css={chartStyles.point}
								pointerEvents="none"
							/>
						</Tooltip>
					))}
				</svg>
			</div>
		</Stack>
	);
}

function SpacingPresetTile({
	kind,
	preset,
	isSelected,
	onSelect,
}: {
	kind: SpacingKind;
	preset: (typeof spacingPresets)[number];
	isSelected: boolean;
	onSelect: () => void;
}) {
	const values = getSpacingValues(kind, preset.settings);
	const insetWidth = 64 + 2 * values.xlarge;
	const insetHeight = 32 + 2 * values.xlarge;
	const previewHeight = 3 * (20 + values.medium) + 2 * values.xxlarge;
	return (
		<Pressable
			xcss={cx(presetStyles.tile, presetStyles.previewTile, isSelected && presetStyles.selected)}
			aria-pressed={isSelected}
			onClick={onSelect}
		>
			<Stack space="space.gap.medium">
				{kind === 'gap' ? (
					<svg
						width="72"
						height={previewHeight * 0.75}
						viewBox={`0 0 96 ${previewHeight}`}
						preserveAspectRatio="xMinYMin meet"
						aria-hidden="true"
						css={presetStyles.preview}
					>
						{/* Keep the content and scale identical so only each preset's gaps change. */}
						{[0, 1, 2].map((sectionIndex) => (
							<g
								key={sectionIndex}
								transform={`translate(0 ${sectionIndex * (20 + values.medium + values.xxlarge)})`}
							>
								<rect width={62} height={5} rx={1} css={presetStyles.previewHeading} />
								{[0, 1, 2].map((lineIndex) => (
									<rect
										key={lineIndex}
										y={5 + values.medium + lineIndex * 6}
										width={lineIndex === 2 ? 69 : 96}
										height={3}
										rx={1}
										css={presetStyles.previewText}
									/>
								))}
							</g>
						))}
					</svg>
				) : (
					<svg
						width={insetWidth * 0.5}
						height={insetHeight * 0.5}
						viewBox={`0 0 ${insetWidth} ${insetHeight}`}
						aria-hidden="true"
						css={presetStyles.preview}
					>
						<rect
							x={0.5}
							y={0.5}
							width={insetWidth - 1}
							height={insetHeight - 1}
							rx={4}
							css={presetStyles.insetSurface}
						/>
						<g transform={`translate(${values.xlarge} ${values.xlarge})`}>
							<rect width={64} height={32} css={presetStyles.insetContent} />
							{[0, 1, 2].map((line) => (
								<rect
									key={line}
									y={4 + line * 10}
									width={line === 2 ? 40 : 64}
									height={4}
									rx={1}
									css={presetStyles.previewText}
								/>
							))}
						</g>
					</svg>
				)}
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

function SpacingPresets({
	kind,
	settings,
	onChange,
}: {
	kind: SpacingKind;
	settings: SpacingSettings;
	onChange: (settings: SpacingSettings) => void;
}) {
	const selectedPreset = spacingPresets.find(
		(preset) =>
			settings.scale === preset.settings.scale &&
			settings.uniformity === preset.settings.uniformity &&
			settings.curve === preset.settings.curve &&
			settings.round === preset.settings.round,
	);
	return (
		<Stack space="space.gap.large">
			<Heading as="h3" size="xsmall">
				Presets
			</Heading>
			<Grid gap="space.gap.medium" xcss={presetStyles.grid}>
				{spacingPresets.map((preset) => (
					<SpacingPresetTile
						kind={kind}
						key={preset.name}
						preset={preset}
						isSelected={selectedPreset === preset}
						onSelect={() => onChange(preset.settings)}
					/>
				))}
			</Grid>
		</Stack>
	);
}

function SpacingScaleControls({
	kind,
	settings,
	onChange,
}: {
	kind: SpacingKind;
	settings: SpacingSettings;
	onChange: (changes: Partial<SpacingSettings>) => void;
}) {
	const labels = spacingLabels[kind];

	return (
		<Stack space="space.gap.xlarge">
			<Heading as="h3" size="xsmall">
				Scale
			</Heading>
			<ScaleSlider
				id={`${kind}-spacing-spacing`}
				label={`${labels.title} scale`}
				value={settings.scale}
				{...SPACING_SCALE}
				onChange={(scale) => onChange({ scale })}
			/>
			<Stack space="space.gap.xsmall">
				<ScaleSlider
					id={`${kind}-spacing-uniformity`}
					label="Scale uniformity"
					value={settings.uniformity}
					min={0}
					max={1}
					step={0.1}
					onChange={(uniformity) => onChange({ uniformity })}
				/>
				<Text size="small" color="color.text.subtle">
					At 0%, the smallest {labels.plural} change gently. At 100%, all {labels.plural} scale
					evenly. The {spacingTokens[kind][0].size}px {labels.singular} stays fixed at 0%
					uniformity.
				</Text>
			</Stack>
			<Stack space="space.gap.xsmall">
				<ScaleSlider
					id={`${kind}-spacing-curve`}
					label="Curve strength"
					value={settings.curve}
					min={0.25}
					max={3}
					step={0.25}
					formatValue={(value) => `${value}×`}
					onChange={(curve) => onChange({ curve })}
				/>
				<Text size="small" color="color.text.subtle">
					Above 1×, changes concentrate in larger {labels.plural}. Below 1×, medium {labels.plural}{' '}
					respond more. Curve strength has no effect at 100% uniformity.
				</Text>
			</Stack>
			<Checkbox
				id={`${kind}-spacing-rounding`}
				label={`Round ${labels.singular} values`}
				isChecked={settings.round}
				onChange={(event) => onChange({ round: event.target.checked })}
			/>
			<Text size="small" color="color.text.subtle">
				Automatic values stay ordered; stronger curves or rounding can make adjacent sizes equal.
			</Text>
		</Stack>
	);
}

function SpacingControls({
	kind,
	settings,
	values,
	onGeneralChange,
	onInspect,
}: {
	kind: SpacingKind;
	settings: SpacingSettings;
	values: Record<SpacingName, number>;
	onGeneralChange: (changes: Partial<SpacingSettings>) => void;
	onInspect?: (token: string | null) => void;
}) {
	const labels = spacingLabels[kind];

	return (
		<Stack role="region" aria-label={`${labels.title} spacing`} space="space.gap.xxlarge">
			<SpacingPresets kind={kind} settings={settings} onChange={onGeneralChange} />

			<SpacingResponseChart kind={kind} values={values} onInspect={onInspect} />

			<SpacingScaleControls kind={kind} settings={settings} onChange={onGeneralChange} />
		</Stack>
	);
}

const layoutOptions = [
	{ label: 'Article', value: 'article' },
	{ label: 'Dashboard', value: 'dashboard' },
	{ label: 'Settings', value: 'settings' },
	{ label: 'Chat', value: 'chat' },
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
	overlayLabel: {
		display: 'inline-flex',
		alignItems: 'center',
		columnGap: token('space.gap.medium'),
	},
	controlPanel: { width: '100%', paddingBlockStart: token('space.200') },
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
	const [gapSettings, setGapSettings] = useState<SpacingSettings>(DEFAULT_SPACING);
	const [insetSettings, setInsetSettings] = useState<SpacingSettings>(DEFAULT_SPACING);
	const [isSettingsLinked, setIsSettingsLinked] = useState(false);
	const [spacingTab, setSpacingTab] = useState(0);
	const updateGeneralSettings = (kind: SpacingKind, changes: Partial<SpacingSettings>) => {
		const update = (current: SpacingSettings) => ({ ...current, ...changes });
		if (kind === 'gap' || isSettingsLinked) setGapSettings(update);
		if (kind === 'inset' || isSettingsLinked) setInsetSettings(update);
	};
	const toggleSettingsLink = (linked: boolean) => {
		if (linked) {
			// Copy settings from the visible tab; each family keeps its own base sizes.
			if (spacingTab === 0) {
				setInsetSettings(gapSettings);
			} else {
				setGapSettings(insetSettings);
			}
		}
		setIsSettingsLinked(linked);
	};
	const [showGaps, setShowGaps] = useState(false);
	const [showInsets, setShowInsets] = useState(false);
	const [activeToken, setActiveToken] = useState<string | null>(null);
	const gapValues = getSpacingValues('gap', gapSettings);
	const insetValues = getSpacingValues('inset', insetSettings);
	return (
		<ThemeProvider defaultColorMode={colorMode}>
			<SyncColorMode colorMode={colorMode} />
			<Grid xcss={previewStyles.page}>
				<Box as="main" padding="space.400" xcss={previewStyles.main}>
					<Stack space="space.300">
						<SpacingInspector showGaps={showGaps} showInsets={showInsets} activeToken={activeToken}>
							<ThemeProvider
								defaultColorMode={colorMode}
								defaultTheme={{
									spacing: {
										id: 'UNSAFE-spacing',
										overrides: {
											dynamicSpaceGapScale: gapSettings.scale,
											dynamicSpaceGapCurve: gapSettings.curve,
											dynamicSpaceGapUniformity: gapSettings.uniformity,
											dynamicSpaceGapRound: gapSettings.round,
											dynamicSpaceInsetScale: insetSettings.scale,
											dynamicSpaceInsetCurve: insetSettings.curve,
											dynamicSpaceInsetUniformity: insetSettings.uniformity,
											dynamicSpaceInsetRound: insetSettings.round,
										},
									},
								}}
							>
								<SyncColorMode colorMode={colorMode} />
								<Box xcss={previewStyles.root} testId="gap-spacing-preview">
									{layout === 'article' && <EditorialBrief />}
									{layout === 'dashboard' && <DashboardLayout />}
									{layout === 'settings' && <SettingsLayout />}
									{layout === 'chat' && <ChatLayout />}
								</Box>
							</ThemeProvider>
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
							<Stack space="space.gap.xsmall" role="group" aria-labelledby="layout-spacing-label">
								<Text
									id="layout-spacing-label"
									size="small"
									weight="semibold"
									color="color.text.subtle"
								>
									Layout overlay
								</Text>
								<Checkbox
									label={
										<span css={previewStyles.overlayLabel}>
											<span>Show gaps</span>
											<SpacingSwatch kind="gap" />
										</span>
									}
									isChecked={showGaps}
									onChange={(event) => setShowGaps(event.target.checked)}
								/>
								<Checkbox
									label={
										<span css={previewStyles.overlayLabel}>
											<span>Show insets</span>
											<SpacingSwatch kind="inset" />
										</span>
									}
									isChecked={showInsets}
									onChange={(event) => setShowInsets(event.target.checked)}
								/>
								<Checkbox
									label="Show all spacing"
									isChecked={showGaps && showInsets}
									isIndeterminate={showGaps !== showInsets}
									onChange={(event) => {
										setShowGaps(event.target.checked);
										setShowInsets(event.target.checked);
									}}
								/>
							</Stack>
						</Stack>
						<Stack space="space.gap.large">
							<Inline spread="space-between" alignBlock="center" space="space.gap.medium">
								<Heading as="h2" size="small">
									Spacing variables
								</Heading>
								<Button
									appearance="subtle"
									spacing="compact"
									aria-label={
										isSettingsLinked
											? 'Reset gaps and insets'
											: spacingTab === 0
												? 'Reset gaps'
												: 'Reset insets'
									}
									onClick={() =>
										updateGeneralSettings(spacingTab === 0 ? 'gap' : 'inset', DEFAULT_SPACING)
									}
								>
									Reset
								</Button>
							</Inline>
							<Stack space="space.gap.xsmall">
								<Inline spread="space-between" alignBlock="center" space="space.gap.medium">
									<Label htmlFor="link-spacing-settings">Link gap and inset settings</Label>
									<Toggle
										id="link-spacing-settings"
										descriptionId="link-spacing-description"
										isChecked={isSettingsLinked}
										onChange={(event) => toggleSettingsLink(event.currentTarget.checked)}
									/>
								</Inline>
								<Text id="link-spacing-description" size="small" color="color.text.subtle">
									Linking copies this tab’s settings to both. Each family keeps its own base sizes.
								</Text>
							</Stack>
						</Stack>
						<Tabs
							id="spacing-controls"
							selected={spacingTab}
							onChange={(index) => {
								setSpacingTab(index);
								setActiveToken(null);
							}}
							shouldUnmountTabPanelOnChange
						>
							<TabList>
								<Tab>Gaps</Tab>
								<Tab>Insets</Tab>
							</TabList>
							<TabPanel>
								<Box xcss={previewStyles.controlPanel}>
									<SpacingControls
										kind="gap"
										settings={gapSettings}
										values={gapValues}
										onGeneralChange={(changes) => updateGeneralSettings('gap', changes)}
										onInspect={setActiveToken}
									/>
								</Box>
							</TabPanel>
							<TabPanel>
								<Box xcss={previewStyles.controlPanel}>
									<SpacingControls
										kind="inset"
										settings={insetSettings}
										values={insetValues}
										onGeneralChange={(changes) => updateGeneralSettings('inset', changes)}
										onInspect={setActiveToken}
									/>
								</Box>
							</TabPanel>
						</Tabs>
					</Stack>
				</Box>
			</Grid>
		</ThemeProvider>
	);
}

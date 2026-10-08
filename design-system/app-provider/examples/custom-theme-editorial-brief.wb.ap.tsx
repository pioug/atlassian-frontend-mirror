/**
 * @jsxRuntime classic
 * @jsx jsx
 */
import React, { useState } from 'react';

import { ThemeProvider } from '@atlaskit/app-provider/theme-provider';
import { useColorMode } from '@atlaskit/app-provider/use-color-mode';
import Button from '@atlaskit/button/default/button';
import IconButton from '@atlaskit/button/icon/button';
import { cssMap, cx, jsx } from '@atlaskit/css';
import { Label } from '@atlaskit/form/label/default';
import Heading from '@atlaskit/heading/heading';
import QuotationMarkIcon from '@atlaskit/icon/core/quotation-mark';
import ShareIcon from '@atlaskit/icon/core/share';
import StoryIcon from '@atlaskit/icon/core/story';
import Image from '@atlaskit/image/image';
import { Box } from '@atlaskit/primitives/compiled/box';
import { Grid } from '@atlaskit/primitives/compiled/grid';
import { Inline } from '@atlaskit/primitives/compiled/inline';
import { MetricText } from '@atlaskit/primitives/compiled/metric-text';
import { Pressable } from '@atlaskit/primitives/compiled/pressable';
import { Stack } from '@atlaskit/primitives/compiled/stack';
import { Text } from '@atlaskit/primitives/compiled/text';
import Range from '@atlaskit/range/range';
import Select from '@atlaskit/select/default';
import { token } from '@atlaskit/tokens';
import type { CustomThemeOverrideRegistry } from '@atlaskit/tokens/custom-theme-overrides';

import coreDesign from './assets/core-design.jpg';
import { CustomThemeShowcase, SyncColorMode } from './shared/custom-theme-showcase';

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

const articleStyles = cssMap({
	root: {
		maxWidth: '760px',
		marginInline: 'auto',
		// borderRadius: token('radius.large'),
		// boxShadow: token('elevation.shadow.raised'),
	},
});

const quoteStyles = cssMap({
	figure: {
		marginBlock: token('space.0'),
		marginInline: token('space.0'),
	},
	pullText: {
		marginBlock: token('space.0'),
		marginInline: token('space.0'),
		// The CSS reset adds literal quotation marks to every blockquote. The pull quote uses the icon
		// instead, so turn the reset's marks off here.
		'&::before': {
			content: 'none',
		},
		'&::after': {
			content: 'none',
		},
	},
	mark: {
		display: 'flex',
		paddingBlock: token('space.100'),
		paddingInline: token('space.100'),
		borderRadius: token('radius.full'),
		borderWidth: token('border.width'),
		borderStyle: 'solid',
		borderColor: token('color.border'),
	},
	inline: {
		marginBlock: token('space.0'),
		marginInline: token('space.0'),
		paddingInlineStart: token('space.300'),
		borderInlineStartWidth: token('border.width.selected'),
		borderInlineStartStyle: 'solid',
		borderInlineStartColor: token('color.border.brand'),
	},
	inlineCaption: {
		paddingBlockStart: token('space.100'),
		paddingInlineStart: token('space.300'),
	},
	pull: {
		marginBlock: token('space.0'),
		marginInline: token('space.0'),
		paddingBlock: token('space.400'),
		paddingInline: token('space.400'),
		borderBlockWidth: token('border.width'),
		borderBlockStyle: 'solid',
		borderBlockColor: token('color.border'),
		textAlign: 'center',
	},
});

const stats: { value: string; label: string; detail: string }[] = [
	{
		value: '63%',
		label: 'of routine drafting handed to AI',
		detail: 'Up 18 points since the first quarter',
	},
	{
		value: '4.2×',
		label: 'faster from question to first answer',
		detail: 'Median across 40 partner teams',
	},
	{
		value: '1,280',
		label: 'decisions with a linked source',
		detail: 'Every summary traceable to its inputs',
	},
	{
		value: '92%',
		label: 'of suggestions reviewed before shipping',
		detail: 'People stay accountable for the result',
	},
];

const statStyles = cssMap({
	figure: {
		marginBlock: token('space.0'),
		marginInline: token('space.0'),
	},
	grid: {
		gridTemplateColumns: 'repeat(2, minmax(0, 1fr))',
	},
	stat: {
		paddingBlockStart: token('space.200'),
		borderBlockStartWidth: token('border.width.selected'),
		borderBlockStartStyle: 'solid',
		borderBlockStartColor: token('color.border.bold'),
	},
});

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
				<article>
					<Box padding="space.500" xcss={articleStyles.root}>
						<Stack space="space.400">
							<Stack space="space.150">
								<Heading size="xxlarge">
									Intelligence is most useful when it stays connected to intent
								</Heading>
								<Text as="p" color="color.text.subtle">
									By the Applied Intelligence Group · 9 min read · October 2026
								</Text>
							</Stack>

							<Stack space="space.200">
								<Heading size="xlarge">The question behind the model</Heading>
								<Text as="p">
									AI systems are becoming remarkably capable at producing language, images, plans,
									and software. Capability alone, however, does not tell us whether a system is
									useful. The more important question is whether the system helps a person hold on
									to the thread of their own work: the constraints they have noticed, the trade-offs
									they are willing to make, and the people who will live with the result.
								</Text>
								<Text as="p">
									We think the next generation of AI should make context easier to recover rather
									than easier to discard. It should be able to summarize a week of decisions without
									flattening the disagreement that made those decisions meaningful. It should make a
									draft easier to begin, while leaving the author enough room to recognize their own
									voice in the finished work.
								</Text>
							</Stack>

							<Stack space="space.200">
								<Heading size="large">AI works best as a collaborator</Heading>
								<Text as="p">
									The promise of automation is often described as a handoff: a person supplies an
									instruction, a machine completes a task, and the work disappears from view. That
									model is appealing because it is simple, but it is not how consequential work is
									done. Important work changes as evidence arrives. It benefits from a second
									question, a revised assumption, and a teammate who can explain why a seemingly
									small detail matters.
								</Text>
								<Text as="p">
									A collaborative system can participate in that motion. It can collect the loose
									ends of a project, propose a starting point, and surface patterns that would have
									been expensive to find manually. The person remains responsible for direction; the
									system makes the space of possible directions easier to see.
								</Text>
							</Stack>

							<Box as="figure" xcss={quoteStyles.figure}>
								<Box as="blockquote" xcss={quoteStyles.inline}>
									<Text as="p" size="large">
										Good AI does not replace judgement. It gives judgement a better view of the
										work.
									</Text>
								</Box>
								<Box as="figcaption" xcss={quoteStyles.inlineCaption}>
									<Text size="small" color="color.text.subtle">
										— <cite>Design principles for applied intelligence</cite>
									</Text>
								</Box>
							</Box>

							<Stack space="space.200">
								<Heading size="medium">Shared context is a capability</Heading>
								<Text as="p">
									Most teams do not lack information; they lack a reliable way to connect it. The
									brief lives in one place, the customer detail in another, and the reasoning behind
									a decision in a conversation that happened three months ago. AI can help assemble
									those fragments into a useful working picture, but it has to make its sources and
									uncertainty visible. A fluent answer without a traceable path is only a polished
									guess.
								</Text>
								<Text as="p">
									That is why interface design matters as much as model design. A useful system
									shows where an idea came from, offers a way to correct it, and treats a person’s
									edits as signal rather than failure. It should make a team more aligned without
									making every conversation sound the same.
								</Text>
							</Stack>

							<Box as="figure" xcss={statStyles.figure}>
								<Stack space="space.200">
									<Box as="figcaption">
										<Text size="small" weight="semibold" color="color.text.subtle">
											By the numbers: six months with our design partners (illustrative)
										</Text>
									</Box>
									<Grid gap="space.300" xcss={statStyles.grid}>
										{stats.map((stat) => (
											<Box key={stat.label} xcss={statStyles.stat}>
												<Stack space="space.050">
													<MetricText size="large">{stat.value}</MetricText>
													<Text weight="medium">{stat.label}</Text>
													<Text size="small" color="color.text.subtle">
														{stat.detail}
													</Text>
												</Stack>
											</Box>
										))}
									</Grid>
								</Stack>
							</Box>

							<Box as="figure" xcss={quoteStyles.pull}>
								<Stack space="space.200" alignInline="center">
									<Box xcss={quoteStyles.mark}>
										<QuotationMarkIcon label="" color={token('color.icon.subtle')} />
									</Box>
									<Box as="blockquote" xcss={quoteStyles.pullText}>
										<Heading as="div" size="large">
											An intelligent tool earns trust by making the next thoughtful action easier,
											not by making thought invisible.
										</Heading>
									</Box>
									<Box as="figcaption">
										<Text size="small" color="color.text.subtle">
											Mara Okafor, Head of Applied Intelligence
										</Text>
									</Box>
								</Stack>
							</Box>

							<Stack space="space.150">
								<Heading size="small">Solid foundations make generous products</Heading>
								<Text as="p">
									The systems behind an AI experience are easy to overlook when they work well. They
									are the evaluation loops that catch a regression before it reaches a customer, the
									permissions model that keeps sensitive context in the right hands, and the
									infrastructure that lets a team improve a feature without rebuilding the world
									around it. Reliability is not separate from creativity; it is what lets people
									experiment without fearing that every experiment will become an incident.
								</Text>
							</Stack>

							<Stack space="space.150">
								<Heading size="xsmall">Learning by doing, and showing the work</Heading>
								<Text as="p">
									The most honest way to understand an AI system is to put it in the hands of people
									who have real work to finish. Their corrections reveal what a benchmark cannot:
									which moments feel effortless, where a suggestion carries the wrong assumption,
									and what a team needs to stay accountable for its own decisions. Product use is
									not merely a destination for research. It is one of the ways research learns.
								</Text>
							</Stack>

							<Stack space="space.100">
								<Heading size="xxsmall">An invitation</Heading>
								<Text as="p" color="color.text.subtle">
									Bring a difficult, unfinished question. The best collaboration begins before
									anyone pretends to know the answer.
								</Text>
							</Stack>

							<Inline alignBlock="center" space="space.100">
								<IconButton icon={ShareIcon} label="Share article" />
								<IconButton icon={StoryIcon} label="Save for later" />
							</Inline>
							<Image src={coreDesign} alt="Core design" />
						</Stack>
					</Box>
				</article>
			</TypographyScope>
		</CustomThemeShowcase>
	);
}

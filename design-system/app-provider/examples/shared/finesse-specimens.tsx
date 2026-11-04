/**
 * @jsxRuntime classic
 * @jsx jsx
 */
import React, { useState } from 'react';

import { css as compiledCss } from '@compiled/react';

import Button from '@atlaskit/button/default/button';
import { cssMap, jsx } from '@atlaskit/css';
import Heading from '@atlaskit/heading/heading';
import CheckMarkIcon from '@atlaskit/icon/core/check-mark';
import { Box } from '@atlaskit/primitives/compiled/box';
import { Inline } from '@atlaskit/primitives/compiled/inline';
import { Stack } from '@atlaskit/primitives/compiled/stack';
import { Text } from '@atlaskit/primitives/compiled/text';
import { token } from '@atlaskit/tokens';

const styles = cssMap({
	swatches: {
		display: 'grid',
		gridTemplateColumns: 'repeat(3, minmax(0, 1fr))',
		gap: token('space.100'),
	},
	swatch: {
		height: '56px',
		borderRadius: token('radius.medium'),
	},
	selected: {
		borderColor: token('color.border.selected'),
		borderStyle: 'solid',
		borderWidth: token('border.width.selected'),
		borderRadius: token('radius.medium'),
	},
	blanket: {
		position: 'relative',
		overflow: 'hidden',
		borderRadius: token('radius.medium'),
	},
	blanketOverlay: {
		position: 'absolute',
		inset: '0',
		pointerEvents: 'none',
	},
	section: {
		borderBlockStartColor: token('color.border'),
		borderBlockStartStyle: 'solid',
		borderBlockStartWidth: token('border.width'),
		paddingBlockStart: token('space.250'),
	},
});

// The bounded cssMap background type excludes blanket tokens; this sample is a blanket.
const blanketOverlayColor = compiledCss({ backgroundColor: token('color.blanket.selected') });

const selectedSamples = [
	{ label: 'Rest', background: 'color.background.selected' },
	{ label: 'Hovered', background: 'color.background.selected.hovered' },
	{ label: 'Pressed', background: 'color.background.selected.pressed' },
] as const;
const boldSamples = [
	{ label: 'Rest', background: 'color.background.selected.bold' },
	{ label: 'Hovered', background: 'color.background.selected.bold.hovered' },
	{ label: 'Pressed', background: 'color.background.selected.bold.pressed' },
] as const;
const subtleSamples = [
	{ label: 'Hovered', background: 'color.background.neutral.subtle.hovered' },
	{ label: 'Pressed', background: 'color.background.neutral.subtle.pressed' },
] as const;
type Sample =
	| (typeof selectedSamples)[number]
	| (typeof boldSamples)[number]
	| (typeof subtleSamples)[number];

function StateSwatches({ samples }: { samples: readonly Sample[] }): React.JSX.Element {
	return (
		<div css={styles.swatches}>
			{samples.map(({ label, background }) => (
				<Stack key={background} space="space.100">
					<Box backgroundColor={background} xcss={styles.swatch} testId={background} />
					<Text size="small">{label}</Text>
				</Stack>
			))}
		</div>
	);
}

function Section({
	title,
	children,
}: {
	title: string;
	children: React.ReactNode;
}): React.JSX.Element {
	return (
		<Stack space="space.150" xcss={styles.section}>
			<Heading as="h3" size="small">
				{title}
			</Heading>
			{children}
		</Stack>
	);
}
export default function FinesseSpecimens(): React.JSX.Element {
	const [selected, setSelected] = useState(true);
	return (
		<Stack space="space.250">
			<Heading as="h2" size="medium">
				Nested theme specimen sheet
			</Heading>
			<Box
				backgroundColor="color.background.selected"
				padding="space.200"
				xcss={styles.selected}
				testId="selected-item"
			>
				<Inline space="space.150" alignBlock="center">
					<CheckMarkIcon label="" color={token('color.icon.selected')} />
					<Stack space="space.050">
						<Text weight="bold" color="color.text.selected">
							Selected work item
						</Text>
						<Text size="small">Background, border, text, and icon all use selected tokens.</Text>
					</Stack>
				</Inline>
			</Box>
			<Inline space="space.100" shouldWrap>
				<Button isSelected={selected} onClick={() => setSelected(!selected)}>
					Toggle selection
				</Button>
				<Button appearance="subtle">Hover or press me</Button>
			</Inline>
			<Text as="p" size="small">
				Try the live buttons above. All hover and pressed states also stay visible in the swatches
				below.
			</Text>
			<Section title="Selected backgrounds">
				<Text as="p" size="small">
					Subtle selection changes from blue to neutral.
				</Text>
				<StateSwatches samples={selectedSamples} />
			</Section>
			<Section title="Bold selected backgrounds">
				<Text as="p" size="small">
					Strong selection changes from blue to a neutral foreground tone.
				</Text>
				<StateSwatches samples={boldSamples} />
			</Section>
			<Section title="Subtle neutral interactions">
				<Text as="p" size="small">
					Finesse softens the hover and pressed overlays.
				</Text>
				<StateSwatches samples={subtleSamples} />
			</Section>
			<Section title="Selected border, text, and icon">
				<Box padding="space.200" xcss={styles.selected} testId="selected-outline">
					<Inline space="space.150" alignBlock="center">
						<CheckMarkIcon label="" color={token('color.icon.selected')} />
						<Text weight="bold" color="color.text.selected">
							Selected outline and foreground
						</Text>
					</Inline>
				</Box>
			</Section>
			<Section title="Selection blanket">
				<Text as="p" size="small">
					A local selection overlay across a content region.
				</Text>
				<Box
					backgroundColor="elevation.surface.raised"
					padding="space.250"
					xcss={styles.blanket}
					testId="blanket-sample"
				>
					<Stack space="space.100">
						<Text weight="bold">Content underneath the overlay</Text>
						<Text>Selection covers this region with the selected blanket token.</Text>
					</Stack>
					<div css={[styles.blanketOverlay, blanketOverlayColor]} data-testid="selection-blanket" />
				</Box>
			</Section>
			<Section title="All four Finesse heading styles">
				<Text as="p" size="small">
					Finesse uses weight 500 for each of these heading sizes.
				</Text>
				<Stack space="space.150">
					<Heading as="h4" size="medium">
						Medium heading
					</Heading>
					<Heading as="h4" size="small">
						Small heading
					</Heading>
					<Heading as="h4" size="xsmall">
						Extra small heading
					</Heading>
					<Heading as="h4" size="xxsmall">
						Smallest heading
					</Heading>
				</Stack>
			</Section>
		</Stack>
	);
}

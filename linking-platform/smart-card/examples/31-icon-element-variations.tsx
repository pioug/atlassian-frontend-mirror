/**
 * @jsxRuntime classic
 * @jsx jsx
 * @jsxFrag React.Fragment
 */
import React, { useCallback, useMemo, useState } from 'react';

import { css, jsx } from '@compiled/react';

import { Checkbox } from '@atlaskit/checkbox';
import { Box, Inline, Stack, Text } from '@atlaskit/primitives/compiled';
import { RadioGroup as AtlaskitRadioGroup } from '@atlaskit/radio';
import Range from '@atlaskit/range';
import { token } from '@atlaskit/tokens';

import { SmartLinkSize } from '../src/constants';

import ExampleContainer from './utils/example-container';
import {
	ALL,
	IconGrid,
	IconVariant,
	iconTypeEntries,
	iconTypeGroups,
	providerIcons,
	sizes,
	type SizeOption,
	type TileOption,
} from './utils/icon-element-variations-shared';

const controlBoxStyles = css({
	backgroundColor: token('color.background.input'),
	paddingTop: token('space.200'),
	paddingRight: token('space.200'),
	paddingBottom: token('space.200'),
	paddingLeft: token('space.200'),
	borderRadius: '3px',
});

const sectionHeadingStyles = css({
	backgroundColor: token('color.background.neutral'),
	paddingBlock: token('space.050'),
	paddingInline: token('space.100'),
});

function RadioGroup<T extends string>({
	name,
	options,
	value,
	onChange,
}: {
	name: string;
	onChange: (v: T) => void;
	options: { label: string; value: T }[];
	value: T;
}) {
	return (
		<Box>
			<AtlaskitRadioGroup
				options={options.map((opt) => ({
					name,
					value: opt.value,
					label: opt.label,
				}))}
				value={value}
				onChange={(event) => onChange(event.currentTarget.value as T)}
			/>
		</Box>
	);
}

const sizeOptions: { label: string; value: SizeOption }[] = [
	{ label: 'All', value: ALL },
	{ label: 'Small', value: SmartLinkSize.Small },
	{ label: 'Medium', value: SmartLinkSize.Medium },
	{ label: 'Large', value: SmartLinkSize.Large },
	{ label: 'XLarge', value: SmartLinkSize.XLarge },
];

const tileOptions: { label: string; value: TileOption }[] = [
	{ label: 'All', value: ALL },
	{ label: 'On', value: 'on' },
	{ label: 'Off', value: 'off' },
];

const titleOptions: { label: string; value: 'show' | 'hide' }[] = [
	{ label: 'Show', value: 'show' },
	{ label: 'Hide', value: 'hide' },
];

const withExperimentsOptions: { label: string; value: 'true' | 'false' }[] = [
	{ label: 'Yes', value: 'true' },
	{ label: 'No', value: 'false' },
];

const sizingOverlayOptions: { label: string; value: 'show' | 'hide' }[] = [
	{ label: 'Show', value: 'show' },
	{ label: 'Hide', value: 'hide' },
];

function useLocalStorageState<T>(key: string, defaultValue: T): [T, (value: T) => void] {
	const storageKey = `example-31-icon-variations-${key}`;
	const [state, setState] = useState<T>(() => {
		try {
			const stored = localStorage.getItem(storageKey);
			return stored !== null ? (JSON.parse(stored) as T) : defaultValue;
		} catch {
			return defaultValue;
		}
	});

	const setPersistedState = useCallback(
		(value: T) => {
			setState(value);
			try {
				localStorage.setItem(storageKey, JSON.stringify(value));
			} catch {
				// storage full or unavailable
			}
		},
		[storageKey],
	);

	return [state, setPersistedState];
}

export default (): React.JSX.Element => {
	const [sizeOption, setSizeOption] = useLocalStorageState<SizeOption>(
		'size',
		SmartLinkSize.Medium,
	);
	const [tileOption, setTileOption] = useLocalStorageState<TileOption>('tile', 'off');
	const [titleOption, setTitleOption] = useLocalStorageState<'show' | 'hide'>('title', 'hide');
	const [gridMinWidth, setGridMinWidth] = useLocalStorageState<number>('gridMinWidth', 40);
	const [withExperimentsOption, setWithExperimentsOption] = useLocalStorageState<string>(
		'withExperiments',
		'true',
	);
	const [groupByDomain, setGroupByDomain] = useLocalStorageState<boolean>('groupByDomain', true);
	const [sizingOverlayOption, setSizingOverlayOption] = useLocalStorageState<'show' | 'hide'>(
		'sizingOverlay',
		'hide',
	);

	const showTitle = titleOption === 'show';
	const showBorder = tileOption === 'off';
	const showSizingOverlay = sizingOverlayOption === 'show';
	const gridTemplateColumns = `repeat(auto-fill, minmax(${gridMinWidth}px, 1fr))`;

	const activeSizes = useMemo(() => (sizeOption === ALL ? sizes : [sizeOption]), [sizeOption]);

	const tileVariants = useMemo(
		() => (tileOption === ALL ? [false, true] : [tileOption === 'on']),
		[tileOption],
	);

	return (
		<ExampleContainer
			title="IconElement — All Variations"
			maxWidth="1200px"
			withExperiments={withExperimentsOption === 'true'}
		>
			<Stack space="space.200">
				{/* Controls */}
				<div css={controlBoxStyles}>
					<Stack space="space.150">
						<Inline space="space.300">
							<Inline space="space.200" alignBlock="start">
								<Text weight="bold">Size:</Text>
								<RadioGroup
									name="size"
									options={sizeOptions}
									value={sizeOption}
									onChange={setSizeOption}
								/>
							</Inline>
							<Inline space="space.200" alignBlock="start">
								<Text weight="bold">Tile:</Text>
								<RadioGroup
									name="tile"
									options={tileOptions}
									value={tileOption}
									onChange={setTileOption}
								/>
							</Inline>
							<Stack space="space.200">
								<Inline space="space.200" alignBlock="start">
									<Text weight="bold">Text:</Text>
									<RadioGroup
										name="title"
										options={titleOptions}
										value={titleOption}
										onChange={setTitleOption}
									/>
								</Inline>
								<Inline space="space.200" alignBlock="start">
									<Text weight="bold">
										Sizing
										<br />
										overlay:
									</Text>
									<RadioGroup
										name="sizing-overlay"
										options={sizingOverlayOptions}
										value={sizingOverlayOption}
										onChange={setSizingOverlayOption}
									/>
								</Inline>
							</Stack>
							<Inline space="space.200" alignBlock="start">
								<Text weight="bold">With experiments:</Text>
								<RadioGroup
									name="with-experiments"
									options={withExperimentsOptions}
									value={withExperimentsOption}
									onChange={setWithExperimentsOption}
								/>
							</Inline>
						</Inline>
						<Inline space="space.200" alignBlock="start" grow="fill">
							<Text weight="bold" color="color.text">
								Grid cell: {gridMinWidth}px
							</Text>
							<Box>
								<Range
									aria-label="Grid cell min width"
									step={10}
									min={30}
									max={300}
									value={gridMinWidth}
									onChange={setGridMinWidth}
								/>
							</Box>
						</Inline>
					</Stack>
				</div>

				{/* Section: IconType enum (icon prop) */}
				<div css={sectionHeadingStyles}>
					<Inline spread="space-between" alignBlock="center">
						<Text size="large" weight="bold">
							icon prop — IconType enum ({iconTypeEntries.length} values)
						</Text>
						<Checkbox
							label="Group by domain"
							isChecked={groupByDomain}
							onChange={(e) => setGroupByDomain(e.currentTarget.checked)}
						/>
					</Inline>
				</div>

				{groupByDomain ? (
					iconTypeGroups.map((group) => (
						<Stack key={group.title} space="space.100">
							<Text weight="bold">{group.title}</Text>
							<IconGrid gridTemplateColumns={gridTemplateColumns}>
								{iconTypeEntries
									.filter(([, v]) => group.filter(v))
									.map(([name, value]) => (
										<IconVariant
											key={name}
											label={name}
											icon={value}
											activeSizes={activeSizes}
											showBorder={showBorder}
											showSizingOverlay={showSizingOverlay}
											showTitle={showTitle}
											tileVariants={tileVariants}
										/>
									))}
							</IconGrid>
						</Stack>
					))
				) : (
					<IconGrid gridTemplateColumns={gridTemplateColumns}>
						{iconTypeEntries.map(([name, value]) => (
							<IconVariant
								key={name}
								label={name}
								icon={value}
								activeSizes={activeSizes}
								showBorder={showBorder}
								showSizingOverlay={showSizingOverlay}
								showTitle={showTitle}
								tileVariants={tileVariants}
							/>
						))}
					</IconGrid>
				)}

				{/* Section: URL-based icons (url prop) */}
				<div css={sectionHeadingStyles}>
					<Text size="large" weight="bold">
						url prop — 3P Provider favicons ({Object.keys(providerIcons).length} providers)
					</Text>
				</div>
				<IconGrid gridTemplateColumns={gridTemplateColumns}>
					{Object.entries(providerIcons).map(([provider, urls]) =>
						urls.map((url, i) => (
							<IconVariant
								key={`${provider}-${i}`}
								label={urls.length > 1 ? `${provider} (${i + 1})` : provider}
								url={url}
								activeSizes={activeSizes}
								showBorder={showBorder}
								showSizingOverlay={showSizingOverlay}
								showTitle={showTitle}
								tileVariants={tileVariants}
							/>
						)),
					)}
				</IconGrid>

				{/* Section: render prop */}
				<div css={sectionHeadingStyles}>
					<Text size="large" weight="bold">
						render prop — Custom render functions
					</Text>
				</div>
				<IconGrid gridTemplateColumns={gridTemplateColumns}>
					<IconVariant
						label="Emoji render"
						render={() => (
							<span role="img" aria-label="rocket">
								🚀
							</span>
						)}
						activeSizes={activeSizes}
						showBorder={showBorder}
						showSizingOverlay={showSizingOverlay}
						showTitle={showTitle}
						tileVariants={tileVariants}
					/>
					<IconVariant
						label="Text render"
						render={() => <span>AB</span>}
						activeSizes={activeSizes}
						showBorder={showBorder}
						showSizingOverlay={showSizingOverlay}
						showTitle={showTitle}
						tileVariants={tileVariants}
					/>
					<IconVariant
						label="SVG render"
						render={() => (
							<svg viewBox="0 0 16 16" width="16" height="16">
								<circle cx="8" cy="8" r="7" fill={token('color.icon.brand')} />
							</svg>
						)}
						activeSizes={activeSizes}
						showBorder={showBorder}
						showSizingOverlay={showSizingOverlay}
						showTitle={showTitle}
						tileVariants={tileVariants}
					/>
				</IconGrid>

				{/* Section: default fallback (no props) */}
				<div css={sectionHeadingStyles}>
					<Text size="large" weight="bold">
						Default fallback — No icon/url/render provided
					</Text>
				</div>
				<IconGrid gridTemplateColumns={gridTemplateColumns}>
					<IconVariant
						label="(default LinkIcon)"
						activeSizes={activeSizes}
						showBorder={showBorder}
						showSizingOverlay={showSizingOverlay}
						showTitle={showTitle}
						tileVariants={tileVariants}
					/>
				</IconGrid>
			</Stack>
		</ExampleContainer>
	);
};

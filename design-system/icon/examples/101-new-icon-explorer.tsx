/**
 * @jsxRuntime classic
 * @jsx jsx
 */
import { Fragment, type SyntheticEvent, useCallback, useEffect, useState } from 'react';

// eslint-disable-next-line @atlaskit/ui-styling-standard/use-compiled -- Ignored via go/DSP-18766
import { css, jsx } from '@compiled/react';

import { Code } from '@atlaskit/code';
import Heading from '@atlaskit/heading';
import { IconTile } from '@atlaskit/icon';
import coreIconLabMetadata from '@atlaskit/icon-lab/metadata';
import metadata, { coreIconMetadata } from '@atlaskit/icon/metadata';
import migrationMap from '@atlaskit/icon/migration-map';
// eslint-disable-next-line @atlaskit/design-system/no-emotion-primitives -- to be migrated to @atlaskit/primitives/compiled – go/akcss
import { Box, Inline, Stack } from '@atlaskit/primitives';
import Textfield from '@atlaskit/textfield';
import { token } from '@atlaskit/tokens';

import FlaskIcon from '../core/flask';

import IconExplorerCell from './utils/new-icon-explorer-cell';
// eslint-disable-next-line no-duplicate-imports
import type { IconExplorerCellProps } from './utils/new-icon-explorer-cell';

type IconsList = Record<string, IconExplorerCellProps>;

const legacyIconPackageMap = Object.keys(migrationMap).reduce(
	(acc, iconName) => {
		// Search for the icon key in metadata that has the matching componentName to the migration map keys
		const metadataKey = Object.keys(metadata).find(
			(key) => metadata[key].componentName === iconName,
		);
		if (metadataKey) {
			acc[iconName] = metadata[metadataKey].package;
		}
		return acc;
	},
	{} as Record<string, string>,
);

// WARNING
// It is going to be very tempting to move these into some higher level abstraction
// They need to live at the root because of the dynamic imports so webpack resolves
// them correctly

const iconInfo = Promise.all(
	Object.keys(coreIconMetadata).map(async (name: string) => {
		const icon = await import(
			/* webpackChunkName: "@atlaskit-internal_icon" */
			`../core/${name}.js`
		);
		return { name, icon: icon.default };
	}),
).then((importedIconData) =>
	importedIconData
		.map((importedIcon) => ({
			[importedIcon.name]: {
				component: importedIcon.icon,
				...coreIconMetadata[importedIcon.name],
			},
		}))
		.reduce((acc, b) => ({ ...acc, ...b })),
);

const localIconInfo = Promise.all(
	Object.keys(coreIconLabMetadata).map(async (name: string) => {
		const icon = await import(
			/* webpackChunkName: "@atlaskit-internal_icon-lab" */
			`@atlaskit/icon-lab/core/${name}.js`
		);
		return { name, icon: icon.default };
	}),
).then((importedIconData) =>
	importedIconData
		.map((importedIcon) => ({
			[importedIcon.name]: {
				component: importedIcon.icon,
				...coreIconLabMetadata[importedIcon.name],
			},
		}))
		.reduce((acc, b) => ({ ...acc, ...b })),
);

const iconExplorerGridStyles = css({
	display: 'flex',
	justifyContent: 'flex-start',
	flexDirection: 'row',
	flexWrap: 'wrap',
});

const noIconsStyles = css({
	paddingBlockEnd: token('space.100', '10px'),
	paddingBlockStart: token('space.100', '10px'),
	paddingInlineEnd: token('space.100', '10px'),
	paddingInlineStart: token('space.100', '10px'),
});

const filterIcons = (icons: IconsList, query: string) => {
	const regex = new RegExp(query);
	return Object.keys(icons)
		.map((index) => icons[index])
		.filter((icon) =>
			[
				...icon.keywords,
				...(icon.oldName || []),
				...(icon?.oldName && typeof icon?.oldName !== 'string'
					? icon.oldName.map((icon) => legacyIconPackageMap[icon])
					: []),
			]
				.map((keyword) => (regex.test(keyword) ? 1 : 0))
				.reduce((allMatches: number, match: number) => allMatches + match, 0),
		);
};

const iconPromise = iconInfo;
const localIconPromise = localIconInfo;

const IconAllExample = () => {
	const [singlePurposeAdsIcons, setSinglePurposeAdsIcons] = useState<IconsList>();
	const [multiPurposeAdsIcons, setMultiPurposeAdsIcons] = useState<IconsList>();
	const [singlePurposeLabIcons, setSinglePurposeLabIcons] = useState<IconsList>();
	const [multiPurposeLabIcons, setMultiPurposeLabIcons] = useState<IconsList>();
	const [query, setQuery] = useState('');

	useEffect(() => {
		iconPromise.then((icons) => {
			// Filter icons object into two categories
			setSinglePurposeAdsIcons(
				Object.fromEntries(
					Object.entries(icons).filter(([_, icon]) => icon.categorization === 'single-purpose'),
				),
			);
			setMultiPurposeAdsIcons(
				Object.fromEntries(
					Object.entries(icons).filter(([_, icon]) => icon.categorization !== 'single-purpose'),
				),
			);
		});
		localIconPromise.then((icons) => {
			// Filter icons object into two categories
			setSinglePurposeLabIcons(
				Object.fromEntries(
					Object.entries(icons).filter(([_, icon]) => icon.categorization === 'single-purpose'),
				),
			);
			setMultiPurposeLabIcons(
				Object.fromEntries(
					Object.entries(icons).filter(([_, icon]) => icon.categorization !== 'single-purpose'),
				),
			);
		});
	}, [
		setSinglePurposeLabIcons,
		setSinglePurposeAdsIcons,
		setMultiPurposeLabIcons,
		setMultiPurposeAdsIcons,
	]);

	const updateQuery = useCallback(
		(newQuery: string) => {
			setQuery(newQuery);
		},
		[setQuery],
	);

	const renderIcons = (allIcons: IconsList) => {
		if (!allIcons) {
			return <div>Loading Icons...</div>;
		}
		const icons: IconExplorerCellProps[] = filterIcons(allIcons, query);
		return icons.length ? (
			<div css={iconExplorerGridStyles}>
				{icons.map((icon) => (
					<IconExplorerCell {...icon} key={icon.componentName} />
				))}
			</div>
		) : (
			<div css={noIconsStyles}>{`Sorry, we couldn't find any icons matching "${query}".`}</div>
		);
	};

	return (
		<Box padding="space.200">
			<Stack space="space.300">
				<Textfield
					value={query}
					placeholder="Search for an icon..."
					key="Icon search"
					onChange={(event: SyntheticEvent<HTMLInputElement>) =>
						updateQuery(event.currentTarget.value)
					}
				/>
				<Heading size="small">
					Core Icons (exported from <Code>@atlaskit/icon/core/*</Code>)
				</Heading>
				{singlePurposeAdsIcons && filterIcons(singlePurposeAdsIcons, query).length > 0 && (
					<Fragment>
						<Heading size="xsmall">{'Single-purpose icons'}</Heading>
						{renderIcons(singlePurposeAdsIcons)}
					</Fragment>
				)}
				{multiPurposeAdsIcons && filterIcons(multiPurposeAdsIcons, query).length > 0 && (
					<Fragment>
						<Heading size="xsmall">{'Multi-purpose icons'}</Heading>
						{renderIcons(multiPurposeAdsIcons)}
					</Fragment>
				)}
				<Inline alignBlock="center" space="space.100">
					<IconTile size="24" appearance="green" label="" icon={FlaskIcon} />
					<Heading size="small">
						Icon lab (exported from <Code>@atlaskit/icon-lab/core/*</Code>)
					</Heading>
				</Inline>
				{singlePurposeLabIcons && filterIcons(singlePurposeLabIcons, query).length > 0 && (
					<Fragment>
						<Heading size="xsmall">{'Single-purpose icons'}</Heading>
						{renderIcons(singlePurposeLabIcons)}
					</Fragment>
				)}
				{multiPurposeLabIcons && filterIcons(multiPurposeLabIcons, query).length > 0 && (
					<Fragment>
						<Heading size="xsmall">{'Multi-purpose icons'}</Heading>
						{renderIcons(multiPurposeLabIcons)}
					</Fragment>
				)}
			</Stack>
		</Box>
	);
};

export default IconAllExample;

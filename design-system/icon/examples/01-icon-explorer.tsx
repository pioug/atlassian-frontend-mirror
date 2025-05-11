/**
 * @jsxRuntime classic
 * @jsx jsx
 */
import { type ComponentType, type SyntheticEvent, useCallback, useEffect, useState } from 'react';

// eslint-disable-next-line @atlaskit/ui-styling-standard/use-compiled -- Ignored via go/DSP-18766
import { css, jsx } from '@compiled/react';

import Button from '@atlaskit/button/new';
import { metaDataWithPackageLoader as fileTypeIconMetadata } from '@atlaskit/icon-file-type/metadata';
import { metaDataWithPackageLoader as objectIconMetadata } from '@atlaskit/icon-object/metadata';
import Link from '@atlaskit/link';
import SectionMessage from '@atlaskit/section-message';
import Textfield from '@atlaskit/textfield';
import { token } from '@atlaskit/tokens';

import { metaDataWithPackageLoader as mainIconMetadata } from '../src/metadata';
import { type LEGACY_Metadata } from '../src/types';
import logoIcons from '../utils/logo-icons';

import IconExplorerCell from './utils/icon-explorer-cell';
// eslint-disable-next-line no-duplicate-imports
import type { IconCommonProps } from './utils/icon-explorer-cell';

type IconsList = Record<string, IconData>;

// WARNING
// It is going to be very tempting to move these into some higher level abstraction
// They need to live at the root because of the dynamic imports so webpack resolves
// them correctly

const createIconMetadataLoader = async (metadata: LEGACY_Metadata) => {
	const newData = await Promise.all(
		Object.entries(metadata).map(async ([name, { packageLoader }]) => {
			const icon = await packageLoader();
			return { name, icon: icon.default };
		}),
	);
	return newData
		.map((icon) => ({
			[icon.name]: {
				...(metadata as { [key: string]: any })[icon.name],
				component: icon.icon,
			},
		}))
		.reduce((acc, b) => ({ ...acc, ...b }));
};

const iconIconInfo = createIconMetadataLoader(mainIconMetadata);
const objectIconInfo = createIconMetadataLoader(objectIconMetadata);
const fileTypeIconInfo = createIconMetadataLoader(fileTypeIconMetadata);

const getAllIcons = async (): Promise<IconsList> => {
	const iconData = await iconIconInfo;
	const objectData = await objectIconInfo;
	const filetypeData = await fileTypeIconInfo;

	return {
		first: {
			componentName: 'divider-icons',
			component: (() => 'exported from @atlaskit/icon') as unknown as ComponentType<any>,
			keywords: getKeywords(mainIconMetadata),
			isDivider: true,
		},
		...iconData,
		firstTwo: {
			componentName: 'divider-product',
			component: (() => 'exported from @atlaskit/logo' as unknown) as ComponentType<any>,
			keywords: getKeywords(logoIcons),
			isDivider: true,
		},
		...logoIcons,
		second: {
			componentName: 'divider-object-icons',
			component: (() => 'exported from @atlaskit/icon-object' as unknown) as ComponentType<any>,
			keywords: getKeywords(objectIconMetadata),
			isDivider: true,
		},
		...objectData,
		third: {
			componentName: 'divider-file-type-icons',
			component: (() => 'exported from @atlaskit/icon-file-type' as unknown) as ComponentType<any>,
			keywords: getKeywords(fileTypeIconMetadata),
			isDivider: true,
		},
		...filetypeData,
	};
};
interface IconData extends IconCommonProps {
	keywords: string[];
}

interface LogoMap {
	[key: string]: Omit<IconData, 'component'>;
}

const getKeywords = (logoMap: LogoMap): IconData['keywords'] =>
	Object.keys(logoMap).reduce(
		(existingKeywords: string[], key: string) => [...existingKeywords, ...logoMap[key].keywords],
		[],
	);

const gridWrapperStyles = css({
	paddingBlockEnd: token('space.0', '0px'),
	paddingBlockStart: token('space.100', '10px'),
	paddingInlineEnd: token('space.050', '5px'),
	paddingInlineStart: token('space.050', '5px'),
});

const iconExplorerGridStyles = css({
	display: 'flex',
	justifyContent: 'flex-start',
	flexDirection: 'row',
	flexWrap: 'wrap',
	marginBlockStart: token('space.100', '10px'),
});

const noIconsStyles = css({
	marginBlockStart: token('space.100', '10px'),
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
			icon.keywords
				.map((keyword) => (regex.test(keyword) ? 1 : 0))
				.reduce((allMatches: number, match: number) => allMatches + match, 0),
		);
};

const allIconsPromise = getAllIcons();

const IconAllExample = () => {
	const [allIcons, setAllIcons] = useState<IconsList>();
	const [query, setQuery] = useState('');
	const [areIconsShowing, setIconsShowing] = useState(false);

	useEffect(() => {
		allIconsPromise.then(setAllIcons);
	}, [setAllIcons]);

	const updateQuery = useCallback(
		(newQuery: string) => {
			setQuery(newQuery);
			setIconsShowing(true);
		},
		[setQuery, setIconsShowing],
	);

	const renderIcons = () => {
		if (!allIcons) {
			return <div>Loading Icons...</div>;
		}
		const icons: IconData[] = filterIcons(allIcons, query);
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
		<div>
			<SectionMessage title="New icons coming soon">
				<p>
					Atlassians, check out the{' '}
					<Link href="https://go.atlassian.com/icon-migration-overview">icons alpha program</Link>{' '}
					for documentation and details. We'll update this page once internal testing is complete.
				</p>
			</SectionMessage>
			<Textfield
				value={query}
				placeholder="Search for an icon..."
				key="Icon search"
				onChange={(event: SyntheticEvent<HTMLInputElement>) =>
					updateQuery(event.currentTarget.value)
				}
			/>
			<div css={gridWrapperStyles}>
				<p>
					<Button appearance="subtle" onClick={() => setIconsShowing((old) => !old)}>
						{areIconsShowing ? 'Hide icons' : 'Show all icons'}
					</Button>
				</p>
				{areIconsShowing ? renderIcons() : null}
			</div>
		</div>
	);
};

export default IconAllExample;

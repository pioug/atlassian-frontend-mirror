/**
 * @jsxRuntime classic
 */
/** @jsx jsx */
import { useState, type SyntheticEvent, type ComponentType, useCallback, useEffect } from 'react';
// eslint-disable-next-line @atlaskit/ui-styling-standard/use-compiled -- Ignored via go/DSP-18766
import { css, jsx } from '@emotion/react';

import Button from '@atlaskit/button/new';
import Textfield from '@atlaskit/textfield';
import objectIconMetadata from '@atlaskit/icon-object/metadata';
import fileTypeIconMetadata from '@atlaskit/icon-file-type/metadata';

import metadata from '../src/metadata';
import IconExplorerCell from './utils/icon-explorer-cell';
import type { IconCommonProps } from './utils/icon-explorer-cell';
import logoIcons from '../utils/logo-icons';
import { token } from '@atlaskit/tokens';

type IconsList = Record<string, IconData>;

// WARNING
// It is going to be very tempting to move these into some higher level abstraction
// They need to live at the root because of the dynamic imports so webpack resolves
// them correctly

const iconIconInfo = Promise.all(
	Object.keys(metadata).map(async (name: string) => {
		const icon = await import(
			/* webpackChunkName: "@atlaskit-internal_icon" */
			`../glyph/${name}.js`
		);
		return { name, icon: icon.default };
	}),
).then((newData) =>
	newData
		.map((icon) => ({
			[icon.name]: {
				...(metadata as { [key: string]: any })[icon.name],
				component: icon.icon,
			},
		}))
		.reduce((acc, b) => ({ ...acc, ...b })),
);
const objectIconInfo = Promise.all(
	Object.keys(objectIconMetadata).map(async (name: string) => {
		const icon = await import(`@atlaskit/icon-object/glyph/${name}.js`);
		return { name, icon: icon.default };
	}),
).then((newData) =>
	newData
		.map((icon) => ({
			[icon.name]: { ...objectIconMetadata[icon.name], component: icon.icon },
		}))
		.reduce((acc, b) => ({ ...acc, ...b })),
);
const fileTypeIconInfo = Promise.all(
	Object.keys(fileTypeIconMetadata).map(async (name: string) => {
		const icon = await import(`@atlaskit/icon-file-type/glyph/${name}.js`);
		return { name, icon: icon.default };
	}),
).then((newData) =>
	newData
		.map((icon) => ({
			[icon.name]: { ...fileTypeIconMetadata[icon.name], component: icon.icon },
		}))
		.reduce((acc, b) => ({ ...acc, ...b })),
);

const getAllIcons = async (): Promise<IconsList> => {
	const iconData = await iconIconInfo;
	const objectData = await objectIconInfo;
	const filetypeData = await fileTypeIconInfo;

	return {
		first: {
			componentName: 'divider-icons',
			component: (() => 'exported from @atlaskit/icon') as unknown as ComponentType<any>,
			keywords: getKeywords(metadata),
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
	padding: `${token('space.100', '10px')} ${token('space.050', '5px')} ${token('space.0', '0px')}`,
});

const iconExplorerGridStyles = css({
	display: 'flex',
	justifyContent: 'flex-start',
	flexDirection: 'row',
	flexWrap: 'wrap',
	marginBlockStart: token('space.100', '10px'),
});

const noIconsStyles = css({
	padding: token('space.100', '10px'),
	marginBlockStart: token('space.100', '10px'),
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
					<Button appearance="subtle" onClick={() => setIconsShowing((old) => !old)} spacing="none">
						{areIconsShowing ? 'Hide icons' : 'Show all icons'}
					</Button>
				</p>
				{areIconsShowing ? renderIcons() : null}
			</div>
		</div>
	);
};

export default IconAllExample;

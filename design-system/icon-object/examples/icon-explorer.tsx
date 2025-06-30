/**
 * @jsxRuntime classic
 * @jsx jsx
 */
import { type ComponentType, type FormEvent, useEffect, useState } from 'react';

import Button from '@atlaskit/button/new';
import { cssMap, jsx } from '@atlaskit/css';
import metadata from '@atlaskit/icon-object/metadata';
import TextField from '@atlaskit/textfield';
import { token } from '@atlaskit/tokens';

import IconExplorerCell from './utils/icon-explorer-cell';

const allIcons = Promise.all(
	Object.keys(metadata).map(async (name) => {
		const icon = await import(`../src/artifacts/glyph/${name}.tsx`);
		return { name, icon: icon.default };
	}),
).then((newData) =>
	newData
		.map((icon) => ({
			[icon.name]: { ...metadata[icon.name], component: icon.icon },
		}))
		.reduce((acc, b) => ({ ...acc, ...b })),
);

const styles = cssMap({
	iconGridWrapper: {
		paddingTop: token('space.150'),
		paddingRight: token('space.050'),
		paddingLeft: token('space.050'),
	},
	iconExplorerGrid: {
		display: 'flex',
		flexDirection: 'row',
		flexWrap: 'wrap',
		justifyContent: 'flex-start',
		marginTop: token('space.150'),
	},
	noIcons: {
		marginTop: token('space.150'),
		paddingTop: token('space.150'),
		paddingRight: token('space.150'),
		paddingBottom: token('space.150'),
		paddingLeft: token('space.150'),
	},
});

interface Icon {
	keywords: string[];
	component: ComponentType<any>;
	componentName: string;
	package: string;
}

const filterIcons = (icons: Record<string, Icon>, query: string) => {
	const regex = new RegExp(query);
	return Object.keys(icons)
		.map((index) => icons[index])
		.filter((icon) =>
			icon.keywords
				.map((keyword) => (regex.test(keyword) ? 1 : 0))
				.reduce<number>((allMatches, match) => allMatches + match, 0),
		);
};

function IconAllExample() {
	const [query, setQuery] = useState('');
	const [showIcons, setShowIcons] = useState(true);
	const [allIconsState, setAllIconsState] = useState<{ [key: string]: Icon }>();

	useEffect(() => {
		allIcons.then((iconsMap) => setAllIconsState(iconsMap));
	}, []);

	const updateQuery = (query: string) => {
		setQuery(query);
		setShowIcons(true);
	};

	const toggleShowIcons = () => setShowIcons((prev) => !prev);

	const renderIcons = () => {
		if (!allIconsState) {
			return <div>Loading Icons...</div>;
		}
		const icons: Icon[] = filterIcons(allIconsState, query);

		return icons.length ? (
			<div css={styles.iconExplorerGrid}>
				{icons.map((icon) => (
					<IconExplorerCell {...icon} key={icon.componentName} />
				))}
			</div>
		) : (
			<div css={styles.noIcons}>{`Sorry, we couldn't find any icons matching "${query}".`}</div>
		);
	};

	return (
		<div>
			<TextField
				key="Icon search"
				onChange={(event: FormEvent<HTMLInputElement>) => updateQuery(event.currentTarget.value)}
				placeholder="Search for an icon..."
				value={query}
			/>
			<div css={styles.iconGridWrapper}>
				<p>
					<Button appearance="subtle" onClick={toggleShowIcons}>
						{showIcons ? 'Hide icons' : 'Show all icons'}
					</Button>
				</p>
				{showIcons ? renderIcons() : null}
			</div>
		</div>
	);
}

export default IconAllExample;

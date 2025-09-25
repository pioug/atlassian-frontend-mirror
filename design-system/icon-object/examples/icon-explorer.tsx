/**
 * @jsxRuntime classic
 * @jsx jsx
 */
import { type ComponentType, type FormEvent, useState } from 'react';

import Button from '@atlaskit/button/new';
import { cssMap, jsx } from '@atlaskit/css';
import metadata from '@atlaskit/icon-object/metadata';
import TextField from '@atlaskit/textfield';
import { token } from '@atlaskit/tokens';

// eslint-disable-next-line @atlaskit/platform/use-entrypoints-in-examples
import { allIcons } from '../src/all-icons';

import IconExplorerCell from './utils/icon-explorer-cell';

// Create the icons map by combining metadata with imported components
const allIconsData: { [key: string]: Icon } = Object.keys(metadata).reduce(
	(acc, iconKey) => {
		// Find the matching component from allIcons array
		const iconComponent = allIcons.find((icon) => {
			// Match by component displayName
			const expectedName = metadata[iconKey].componentName;
			return icon.displayName === expectedName;
		});

		if (iconComponent) {
			acc[iconKey] = {
				...metadata[iconKey],
				component: iconComponent,
			};
		}

		return acc;
	},
	{} as { [key: string]: Icon },
);

const styles = cssMap({
	iconGridWrapper: {
		paddingBlockStart: token('space.150'),
		paddingInlineEnd: token('space.050'),
		paddingInlineStart: token('space.050'),
	},
	iconExplorerGrid: {
		display: 'flex',
		flexDirection: 'row',
		flexWrap: 'wrap',
		justifyContent: 'flex-start',
		marginBlockStart: token('space.150'),
	},
	noIcons: {
		marginBlockStart: token('space.150'),
		paddingBlockStart: token('space.150'),
		paddingInlineEnd: token('space.150'),
		paddingBlockEnd: token('space.150'),
		paddingInlineStart: token('space.150'),
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

	const updateQuery = (query: string) => {
		setQuery(query);
		setShowIcons(true);
	};

	const toggleShowIcons = () => setShowIcons((prev) => !prev);

	const renderIcons = () => {
		const icons: Icon[] = filterIcons(allIconsData, query);

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

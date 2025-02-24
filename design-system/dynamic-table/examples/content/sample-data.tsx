/**
 * @jsxRuntime classic
 * @jsx jsx
 */
import { type FC, type ReactNode } from 'react';

// eslint-disable-next-line @atlaskit/ui-styling-standard/use-compiled -- Ignored via go/DSP-18766
import { css, jsx } from '@emotion/react';

import Avatar from '@atlaskit/avatar';
import DropdownMenu, { DropdownItem, DropdownItemGroup } from '@atlaskit/dropdown-menu';
import StarStarredIcon from '@atlaskit/icon/core/star-starred';
import StarUnstarredIcon from '@atlaskit/icon/core/star-unstarred';
import Link from '@atlaskit/link';
import { Box, Flex, xcss } from '@atlaskit/primitives';

import { lorem } from './lorem';
import { presidents } from './presidents';

interface President {
	id: number;
	name: string;
	party: string;
	term: string;
}

function kebabCase(input: string) {
	return input
		.match(/[A-Z]{2,}(?=[A-Z][a-z]+[0-9]*|\b)|[A-Z]?[a-z]+[0-9]*|[A-Z]|[0-9]+/g)!
		.map((x) => x.toLowerCase())
		.join('-');
}

function createKey(input: string) {
	return input ? input.replace(/^(the|a|an)/, '').replace(/\s/g, '') : input;
}

function iterateThroughLorem(index: number) {
	return index > lorem.length ? index - lorem.length : index;
}

const nameWrapperStyles = css({
	display: 'flex',
	alignItems: 'center',
});

const NameWrapper: FC<{ children: ReactNode }> = ({ children }) => (
	<span css={nameWrapperStyles}>{children}</span>
);

const avatarWrapperStyles = xcss({
	marginInlineEnd: 'space.100',
});

const AvatarWrapper: FC<{ children: ReactNode }> = ({ children }) => (
	<Box xcss={avatarWrapperStyles}>{children}</Box>
);

const starWrapperStyles = xcss({
	padding: 'space.050',
});

const StarWrapper: FC<{ children: ReactNode }> = ({ children }) => (
	<Flex xcss={starWrapperStyles} alignItems="center">
		{children}
	</Flex>
);

export const caption = 'List of US Presidents';

const getCommonCells = (withWidth: boolean) => [
	{
		key: 'name',
		content: 'Name',
		isSortable: true,
		width: withWidth ? 25 : undefined,
	},
	{
		key: 'party',
		content: 'Party',
		shouldTruncate: true,
		isSortable: true,
		width: withWidth ? 15 : undefined,
	},
	{
		key: 'term',
		content: 'Term',
		shouldTruncate: true,
		isSortable: true,
		width: withWidth ? 10 : undefined,
	},
	{
		key: 'content',
		content: 'Comment',
		shouldTruncate: true,
	},
	{
		key: 'more',
		content: 'Actions',
		shouldTruncate: true,
	},
];

export const createHead = (withWidth: boolean) => {
	return {
		cells: getCommonCells(withWidth),
	};
};

export const head = createHead(true);

export const visuallyRefreshedCreateHead = (withWidth: boolean) => {
	return {
		cells: [
			...getCommonCells(withWidth),
			{
				key: 'star',
				content: (
					<StarWrapper>
						<StarStarredIcon label="Starred" />
					</StarWrapper>
				),
				isSortable: true,
				isIconOnlyHeader: true,
			},
		],
	};
};

export const visuallyRefreshedHead = visuallyRefreshedCreateHead(true);

const createBaseCells = (president: President, index: number) => [
	{
		key: createKey(president.name),
		content: (
			<NameWrapper>
				<AvatarWrapper>
					<Avatar name={president.name} size="medium" />
				</AvatarWrapper>
				<Link href="https://atlassian.design">{president.name}</Link>
			</NameWrapper>
		),
	},
	{
		key: createKey(president.party),
		content: president.party,
	},
	{
		key: president.id,
		content: president.term,
	},
	{
		key: 'Lorem',
		content: iterateThroughLorem(index),
	},
	{
		key: 'MoreDropdown',
		content: (
			<DropdownMenu trigger="More" label={`More about ${president.name}`}>
				<DropdownItemGroup>
					<DropdownItem>{president.name}</DropdownItem>
				</DropdownItemGroup>
			</DropdownMenu>
		),
	},
];

export const rows = presidents.map((president: President, index: number) => ({
	// Using president name + term because the name is not unique
	// e.g. Grover Cleveland has two non-consecutive terms
	// This caused React `key` non-unique warnings
	key: `${kebabCase(president.name)}-${president.term}`,
	isHighlighted: false,
	cells: createBaseCells(president, index),
}));

export const visuallyRefreshedRows = presidents.map((president: President, index: number) => ({
	key: kebabCase(president.name),
	isHighlighted: false,
	cells: [
		...createBaseCells(president, index),
		{
			key: 'Star',
			content: (
				<StarWrapper>
					<StarUnstarredIcon label="Unstarred" />
				</StarWrapper>
			),
		},
	],
}));

export const rowsWithTestIdOverrides = rows.map((row) => ({
	...row,
	testId: `foo--row-${typeof row.key === 'string' ? kebabCase(row.key) : row.key}`,
	cells: row.cells.map((cell) => ({
		...cell,
		testId: `foo--cell-${typeof cell.key === 'string' ? kebabCase(cell.key) : cell.key}`,
	})),
}));

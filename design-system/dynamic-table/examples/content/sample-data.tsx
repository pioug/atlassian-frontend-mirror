/**
 * @jsxRuntime classic
 * @jsx jsx
 */
import { type FC, type ReactNode } from 'react';

// eslint-disable-next-line @atlaskit/ui-styling-standard/use-compiled -- Ignored via go/DSP-18766
import { css, jsx } from '@emotion/react';
import kebabCase from 'lodash/kebabCase';

import Avatar from '@atlaskit/avatar';
import DropdownMenu, { DropdownItem, DropdownItemGroup } from '@atlaskit/dropdown-menu';
import Link from '@atlaskit/link';
import { Box, xcss } from '@atlaskit/primitives';

import { lorem } from './lorem';
import { presidents } from './presidents';

interface President {
	id: number;
	name: string;
	party: string;
	term: string;
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

export const caption = 'List of US Presidents';

export const createHead = (withWidth: boolean) => {
	return {
		cells: [
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
		],
	};
};

export const head = createHead(true);

export const rows = presidents.map((president: President, index: number) => ({
	key: kebabCase(president.name),
	isHighlighted: false,
	cells: [
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

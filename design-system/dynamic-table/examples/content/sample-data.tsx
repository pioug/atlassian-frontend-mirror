/**
 * @jsxRuntime classic
 * @jsx jsx
 */
import { type FC, type ReactNode } from 'react';

import { css, cssMap, jsx } from '@compiled/react';

import Avatar from '@atlaskit/avatar';
import DropdownMenu, { DropdownItem, DropdownItemGroup } from '@atlaskit/dropdown-menu';
import StarStarredIcon from '@atlaskit/icon/core/star-starred';
import StarUnstarredIcon from '@atlaskit/icon/core/star-unstarred';
import Link from '@atlaskit/link';
import { Flex } from '@atlaskit/primitives/compiled';
import { token } from '@atlaskit/tokens';

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

const avatarWrapperStyles = css({
	marginInlineEnd: token('space.100'),
});

const AvatarWrapper: FC<{ children: ReactNode }> = ({ children }) => (
	// eslint-disable-next-line @atlaskit/design-system/use-primitives
	<div css={avatarWrapperStyles}>{children}</div>
);

const starWrapperStyles = cssMap({
	root: {
		paddingBlockEnd: token('space.050'),
		paddingBlockStart: token('space.050'),
		paddingInlineEnd: token('space.050'),
		paddingInlineStart: token('space.050'),
	},
});

const StarWrapper: FC<{ children: ReactNode }> = ({ children }) => (
	<Flex xcss={starWrapperStyles.root} alignItems="center">
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

export const createHead: (withWidth: boolean) => {
    cells: ({
        key: string;
        content: string;
        isSortable: boolean;
        width: number | undefined;
        shouldTruncate?: undefined;
    } | {
        key: string;
        content: string;
        shouldTruncate: boolean;
        isSortable: boolean;
        width: number | undefined;
    } | {
        key: string;
        content: string;
        shouldTruncate: boolean;
        isSortable?: undefined;
        width?: undefined;
    })[];
} = (withWidth: boolean) => {
	return {
		cells: getCommonCells(withWidth),
	};
};

export const head: {
    cells: ({
        key: string;
        content: string;
        isSortable: boolean;
        width: number | undefined;
        shouldTruncate?: undefined;
    } | {
        key: string;
        content: string;
        shouldTruncate: boolean;
        isSortable: boolean;
        width: number | undefined;
    } | {
        key: string;
        content: string;
        shouldTruncate: boolean;
        isSortable?: undefined;
        width?: undefined;
    })[];
} = createHead(true);

export const visuallyRefreshedCreateHead: (withWidth: boolean) => {
    cells: ({
        key: string;
        content: string;
        isSortable: boolean;
        width: number | undefined;
        shouldTruncate?: undefined;
    } | {
        key: string;
        content: string;
        shouldTruncate: boolean;
        isSortable: boolean;
        width: number | undefined;
    } | {
        key: string;
        content: string;
        shouldTruncate: boolean;
        isSortable?: undefined;
        width?: undefined;
    } | {
        key: string;
        content: JSX.Element;
        isSortable: boolean;
        isIconOnlyHeader: boolean;
    })[];
} = (withWidth: boolean) => {
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

export const visuallyRefreshedHead: {
    cells: ({
        key: string;
        content: string;
        isSortable: boolean;
        width: number | undefined;
        shouldTruncate?: undefined;
    } | {
        key: string;
        content: string;
        shouldTruncate: boolean;
        isSortable: boolean;
        width: number | undefined;
    } | {
        key: string;
        content: string;
        shouldTruncate: boolean;
        isSortable?: undefined;
        width?: undefined;
    } | {
        key: string;
        content: JSX.Element;
        isSortable: boolean;
        isIconOnlyHeader: boolean;
    })[];
} = visuallyRefreshedCreateHead(true);

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
			<DropdownMenu shouldRenderToParent trigger="More" label={`More about ${president.name}`}>
				<DropdownItemGroup>
					<DropdownItem>{president.name}</DropdownItem>
				</DropdownItemGroup>
			</DropdownMenu>
		),
	},
];

export const rows: {
    key: string;
    isHighlighted: boolean;
    cells: ({
        key: string;
        content: JSX.Element;
    } | {
        key: string;
        content: string;
    } | {
        key: number;
        content: string;
    } | {
        key: string;
        content: number;
    })[];
}[] = presidents.map((president: President, index: number) => ({
	// Using president name + term because the name is not unique
	// e.g. Grover Cleveland has two non-consecutive terms
	// This caused React `key` non-unique warnings
	key: `${kebabCase(president.name)}-${president.term}`,
	isHighlighted: false,
	cells: createBaseCells(president, index),
}));

export const visuallyRefreshedRows: {
    key: string;
    isHighlighted: boolean;
    cells: ({
        key: string;
        content: JSX.Element;
    } | {
        key: string;
        content: string;
    } | {
        key: number;
        content: string;
    } | {
        key: string;
        content: number;
    })[];
}[] = presidents.map((president: President, index: number) => ({
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

export const rowsWithTestIdOverrides: {
    testId: string;
    cells: ({
        testId: string;
        key: string;
        content: JSX.Element;
    } | {
        testId: string;
        key: string;
        content: string;
    } | {
        testId: string;
        key: number;
        content: string;
    } | {
        testId: string;
        key: string;
        content: number;
    })[];
    key: string;
    isHighlighted: boolean;
}[] = rows.map((row) => ({
	...row,
	testId: `foo--row-${typeof row.key === 'string' ? kebabCase(row.key) : row.key}`,
	cells: row.cells.map((cell) => ({
		...cell,
		testId: `foo--cell-${typeof cell.key === 'string' ? kebabCase(cell.key) : cell.key}`,
	})),
}));

/* sample-data.js */
/**
 * @jsxRuntime classic
 * @jsx jsx
 */
import { type FC, type ReactNode } from 'react';

import { css, jsx } from '@compiled/react';

import Avatar from '@atlaskit/avatar';
import Link from '@atlaskit/link';
import { token } from '@atlaskit/tokens';

import { presidents } from './numerical';

interface President {
	id: number;
	name: string;
	party: string;
	number: number | string;
}

function createKey(input: string) {
	return input ? input.replace(/\s/g, '') : input;
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

export const caption = 'Sample Numerical Data';

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
    })[];
} = (withWidth: boolean) => {
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
				key: 'numeric',
				content: 'Arbitrary Number',
				isSortable: true,
				width: withWidth ? 10 : undefined,
			},
		],
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
    })[];
} = createHead(true);

export const rows: {
    key: string;
    cells: ({
        key: string;
        content: JSX.Element;
    } | {
        key: string | number;
        content: string | number;
    })[];
}[] = presidents.map((president: President, index: number) => ({
	key: `row-${index}-${president.name}`,
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
			key: president.number,
			content: president.number,
		},
	],
}));

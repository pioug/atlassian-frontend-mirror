/* sample-data.js */
/**
 * @jsxRuntime classic
 * @jsx jsx
 */
import { type FC, type ReactNode } from 'react';

// eslint-disable-next-line @atlaskit/ui-styling-standard/use-compiled -- Ignored via go/DSP-18766
import { css, jsx } from '@emotion/react';

import Avatar from '@atlaskit/avatar';
import Link from '@atlaskit/link';
import { Box, xcss } from '@atlaskit/primitives';

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

const avatarWrapperStyles = xcss({
	marginInlineEnd: 'space.100',
});

const AvatarWrapper: FC<{ children: ReactNode }> = ({ children }) => (
	<Box xcss={avatarWrapperStyles}>{children}</Box>
);

export const caption = 'Sample Numerical Data';

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
				key: 'numeric',
				content: 'Arbitrary Number',
				isSortable: true,
				width: withWidth ? 10 : undefined,
			},
		],
	};
};

export const head = createHead(true);

export const rows = presidents.map((president: President, index: number) => ({
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

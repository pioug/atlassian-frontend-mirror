/* eslint-disable import/no-extraneous-dependencies */
import React, { type ReactNode } from 'react';

import Heading from '@atlaskit/heading';
import { Box, Inline, Stack, xcss } from '@atlaskit/primitives';
import { token } from '@atlaskit/tokens';

const shrinkWrapStyles = xcss({
	height: token('space.300'),
	width: token('space.300'),
});

export const ShrinkWrap = ({ children }: { children?: ReactNode }) => (
	<Box xcss={shrinkWrapStyles}>{children}</Box>
);

export const Block = ({
	children,
	heading,
	testId,
}: {
	children?: ReactNode;
	heading?: string;
	testId?: string;
}) => (
	<Stack testId={testId} space="space.100">
		{heading ? (
			<Heading size="small" as="div">
				{heading}
			</Heading>
		) : null}
		<Inline space="space.150" alignBlock="end" shouldWrap>
			{children}
		</Inline>
	</Stack>
);

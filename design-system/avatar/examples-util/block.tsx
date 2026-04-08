import React from 'react';
import { type ReactNode } from 'react';

import Heading from '@atlaskit/heading';
import { Inline, Stack } from '@atlaskit/primitives/compiled';

export const Block: ({
	children,
	heading,
	testId,
}: {
	children?: ReactNode;
	heading?: string;
	testId?: string;
}) => JSX.Element = ({
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

/**
 * @jsxRuntime classic
 * @jsx jsx
 */

import { type ReactNode } from 'react';

import { cssMap, jsx } from '@atlaskit/css';
import Heading from '@atlaskit/heading';
import { Box, Inline, Stack } from '@atlaskit/primitives/compiled';

const styles = cssMap({
	shrinkWrap: {
		height: '24px',
		width: '24px',
	},
});

export const ShrinkWrap = ({ children }: { children?: ReactNode }) => (
	<Box xcss={styles.shrinkWrap}>{children}</Box>
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

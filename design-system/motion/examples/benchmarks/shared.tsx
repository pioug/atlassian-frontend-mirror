/**
 * @jsxRuntime classic
 * @jsx jsx
 */
import type { ReactNode } from 'react';

import { cssMap, jsx } from '@atlaskit/css';
import Heading from '@atlaskit/heading/heading';
import { Stack } from '@atlaskit/primitives/compiled/stack';
import { Text } from '@atlaskit/primitives/compiled/text';
import { token } from '@atlaskit/tokens';

const styles = cssMap({
	layout: {
		maxWidth: '720px',
		paddingBlockStart: token('space.200'),
		paddingBlockEnd: token('space.200'),
		paddingInlineStart: token('space.200'),
		paddingInlineEnd: token('space.200'),
	},
	surface: {
		backgroundColor: token('elevation.surface.raised'),
		borderColor: token('color.border'),
		borderRadius: token('radius.medium'),
		borderStyle: 'solid',
		borderWidth: token('border.width'),
		paddingBlockStart: token('space.200'),
		paddingBlockEnd: token('space.200'),
		paddingInlineStart: token('space.200'),
		paddingInlineEnd: token('space.200'),
	},
});

export function BenchmarkLayout({
	title,
	description,
	children,
}: {
	title: string;
	description: string;
	children: ReactNode;
}): JSX.Element {
	return (
		<Stack space="space.200" xcss={styles.layout}>
			<Stack space="space.050">
				<Heading size="medium">{title}</Heading>
				<Text color="color.text.subtle">{description}</Text>
			</Stack>
			{children}
		</Stack>
	);
}

export function BenchmarkSurface({ children }: { children: ReactNode }): JSX.Element {
	return <div css={styles.surface}>{children}</div>;
}

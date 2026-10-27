/**
 * @jsxRuntime classic
 * @jsx jsx
 */
import { useState } from 'react';

import Button from '@atlaskit/button/default/button';
import { cssMap, jsx } from '@atlaskit/css';
import { Stack } from '@atlaskit/primitives/compiled/stack';
import { Text } from '@atlaskit/primitives/compiled/text';
import { token } from '@atlaskit/tokens';

import { BenchmarkLayout } from './shared';

const styles = cssMap({
	card: {
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
	compact: {
		maxWidth: '280px',
	},
	detailed: {
		maxWidth: '560px',
	},
});

/**
 * Benchmark prompt:
 * Add motion when this card changes between its compact and detailed content. Both dimensions may
 * change and the final size is not known in advance.
 */
export default function CardDimensionsBenchmark(): JSX.Element {
	const [isDetailed, setIsDetailed] = useState(false);

	return (
		<BenchmarkLayout
			title="Project card"
			description="Switch between compact and detailed content."
		>
			<div css={[styles.card, isDetailed ? styles.detailed : styles.compact]}>
				<Stack space="space.100">
					<Text weight="semibold">Navigation refresh</Text>
					<Text color="color.text.subtle">
						{isDetailed
							? 'Align the information architecture and navigation patterns used across Jira, Confluence, and Atlas.'
							: 'Align navigation across products.'}
					</Text>
					{isDetailed && (
						<Text>
							The detailed view includes project context, affected products, risks, and the next
							review date.
						</Text>
					)}
					<Button onClick={() => setIsDetailed((detailed) => !detailed)}>
						{isDetailed ? 'Show compact view' : 'Show detailed view'}
					</Button>
				</Stack>
			</div>
		</BenchmarkLayout>
	);
}

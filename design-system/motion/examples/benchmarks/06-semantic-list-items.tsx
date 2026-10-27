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
	list: {
		display: 'grid',
		gap: token('space.100'),
		listStyle: 'none',
		marginBlockStart: token('space.0'),
		marginBlockEnd: token('space.0'),
		paddingInlineStart: token('space.0'),
	},
	item: {
		backgroundColor: token('elevation.surface.raised'),
		borderRadius: token('radius.medium'),
		paddingBlockStart: token('space.150'),
		paddingBlockEnd: token('space.150'),
		paddingInlineStart: token('space.150'),
		paddingInlineEnd: token('space.150'),
	},
});

/**
 * Benchmark prompt:
 * Add entry and exit motion to these list items without adding markup between the `ul` and `li`
 * elements.
 */
export default function SemanticListItemsBenchmark(): JSX.Element {
	const [isVisible, setIsVisible] = useState(true);

	return (
		<BenchmarkLayout
			title="Semantic list"
			description="Toggle a list item without changing its markup."
		>
			<Stack space="space.150">
				<Button onClick={() => setIsVisible((visible) => !visible)}>
					{isVisible ? 'Remove second item' : 'Add second item'}
				</Button>
				<ul css={styles.list}>
					<li css={styles.item}>
						<Text>First item</Text>
					</li>
					{isVisible && (
						<li css={styles.item}>
							<Text>Second item</Text>
						</li>
					)}
					<li css={styles.item}>
						<Text>Third item</Text>
					</li>
				</ul>
			</Stack>
		</BenchmarkLayout>
	);
}

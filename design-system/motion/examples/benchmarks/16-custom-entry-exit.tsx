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
	panel: {
		backgroundColor: token('color.background.accent.blue.subtlest'),
		borderColor: token('color.border.accent.blue'),
		borderRadius: token('radius.medium'),
		borderStyle: 'solid',
		borderWidth: token('border.width'),
		maxWidth: '360px',
		paddingBlockStart: token('space.200'),
		paddingBlockEnd: token('space.200'),
		paddingInlineStart: token('space.200'),
		paddingInlineEnd: token('space.200'),
	},
});

/**
 * Benchmark prompt:
 * Add an entry and exit treatment for this contextual panel. Combine movement with fading, using
 * the design system wherever possible.
 */
export default function CustomEntryExitBenchmark(): JSX.Element {
	const [isVisible, setIsVisible] = useState(false);

	return (
		<BenchmarkLayout title="Contextual panel" description="Show or hide supporting information.">
			<Stack space="space.150">
				<Button onClick={() => setIsVisible((visible) => !visible)}>
					{isVisible ? 'Hide context' : 'Show context'}
				</Button>
				{isVisible && (
					<div css={styles.panel}>
						<Stack space="space.050">
							<Text weight="semibold">Why this changed</Text>
							<Text>The due date moved because the design review needs another round.</Text>
						</Stack>
					</div>
				)}
			</Stack>
		</BenchmarkLayout>
	);
}

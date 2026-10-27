/**
 * @jsxRuntime classic
 * @jsx jsx
 */
import { useState } from 'react';

import Button from '@atlaskit/button/default/button';
import { cssMap, jsx } from '@atlaskit/css';
import { Stack } from '@atlaskit/primitives/compiled/stack';
import { token } from '@atlaskit/tokens';

import { BenchmarkLayout } from './shared';

const styles = cssMap({
	toolbar: {
		display: 'inline-flex',
		maxWidth: 'max-content',
		alignItems: 'center',
		gap: token('space.100'),
		backgroundColor: token('elevation.surface.raised'),
		borderColor: token('color.border'),
		borderRadius: token('radius.medium'),
		borderStyle: 'solid',
		borderWidth: token('border.width'),
		paddingBlockStart: token('space.100'),
		paddingBlockEnd: token('space.100'),
		paddingInlineStart: token('space.100'),
		paddingInlineEnd: token('space.100'),
	},
});

/**
 * Benchmark prompt:
 * Animate this toolbar's width when optional actions are added or removed. Preserve its existing
 * flex layout.
 */
export default function ToolbarWidthBenchmark(): JSX.Element {
	const [showOptionalActions, setShowOptionalActions] = useState(false);

	return (
		<BenchmarkLayout title="Editor toolbar" description="Toggle optional toolbar actions.">
			<Stack space="space.150">
				<Button onClick={() => setShowOptionalActions((visible) => !visible)}>
					{showOptionalActions ? 'Hide optional actions' : 'Show optional actions'}
				</Button>
				<div css={styles.toolbar} role="toolbar" aria-label="Editor actions">
					<Button>Save</Button>
					{showOptionalActions && <Button>Share</Button>}
					{showOptionalActions && <Button>Export</Button>}
				</div>
			</Stack>
		</BenchmarkLayout>
	);
}

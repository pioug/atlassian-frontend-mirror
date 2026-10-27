/**
 * @jsxRuntime classic
 * @jsx jsx
 */
import { cssMap, jsx } from '@atlaskit/css';
import { Stack } from '@atlaskit/primitives/compiled/stack';
import { Text } from '@atlaskit/primitives/compiled/text';
import { token } from '@atlaskit/tokens';

import { BenchmarkLayout } from './shared';

const styles = cssMap({
	tile: {
		width: '320px',
		backgroundColor: token('elevation.surface.raised'),
		borderColor: token('color.border'),
		borderRadius: token('radius.medium'),
		borderStyle: 'solid',
		borderWidth: token('border.width'),
		color: token('color.text'),
		cursor: 'pointer',
		paddingBlockStart: token('space.200'),
		paddingBlockEnd: token('space.200'),
		paddingInlineStart: token('space.200'),
		paddingInlineEnd: token('space.200'),
		textAlign: 'start',
		'&:hover': {
			backgroundColor: token('elevation.surface.raised.hovered'),
		},
		'&:active': {
			backgroundColor: token('elevation.surface.raised.pressed'),
		},
	},
});

/**
 * Benchmark prompt:
 * Add subtle motion feedback to this tile's existing hover and pressed states. Do not change its
 * layout.
 */
export default function InteractiveTileBenchmark(): JSX.Element {
	return (
		<BenchmarkLayout title="Interactive tile" description="Hover and press the project tile.">
			<button css={styles.tile} type="button">
				<Stack space="space.050">
					<Text weight="semibold">Create a project</Text>
					<Text color="color.text.subtle">Start from a template or a blank project.</Text>
				</Stack>
			</button>
		</BenchmarkLayout>
	);
}

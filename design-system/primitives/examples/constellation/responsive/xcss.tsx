/**
 * @jsxRuntime classic
 * @jsx jsx
 */
import { cssMap, jsx } from '@atlaskit/css';
import { Box } from '@atlaskit/primitives/compiled';
import { token } from '@atlaskit/tokens';

const styles = cssMap({
	card: {
		borderColor: token('color.border.discovery'),
		borderStyle: 'solid',
		borderWidth: 0,
		paddingBlockStart: token('space.050'),
		paddingInlineEnd: token('space.050'),
		paddingBlockEnd: token('space.050'),
		paddingInlineStart: token('space.050'),
		'@media (min-width: 30rem)': {
			paddingBlockStart: token('space.100'),
			paddingInlineEnd: token('space.100'),
			paddingBlockEnd: token('space.100'),
			paddingInlineStart: token('space.100'),
		},
		'@media (min-width: 48rem)': {
			borderWidth: token('border.width'),
			paddingBlockStart: token('space.150'),
			paddingInlineEnd: token('space.150'),
			paddingBlockEnd: token('space.150'),
			paddingInlineStart: token('space.150'),
		},
		'@media (min-width: 64rem)': {
			borderWidth: token('border.width.selected'),
			paddingBlockStart: token('space.200'),
			paddingInlineEnd: token('space.200'),
			paddingBlockEnd: token('space.200'),
			paddingInlineStart: token('space.200'),
		},
	},
});

export default () => (
	<Box xcss={styles.card}>
		Border becomes narrower at smaller breakpoints. Try it out by resizing the browser window.
	</Box>
);

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
		paddingTop: token('space.050'),
		paddingRight: token('space.050'),
		paddingBottom: token('space.050'),
		paddingLeft: token('space.050'),
		'@media (min-width: 30rem)': {
			paddingTop: token('space.100'),
			paddingRight: token('space.100'),
			paddingBottom: token('space.100'),
			paddingLeft: token('space.100'),
		},
		'@media (min-width: 48rem)': {
			borderWidth: token('border.width'),
			paddingTop: token('space.150'),
			paddingRight: token('space.150'),
			paddingBottom: token('space.150'),
			paddingLeft: token('space.150'),
		},
		'@media (min-width: 64rem)': {
			borderWidth: token('border.width.outline'),
			paddingTop: token('space.200'),
			paddingRight: token('space.200'),
			paddingBottom: token('space.200'),
			paddingLeft: token('space.200'),
		},
	},
});

export default () => (
	<Box xcss={styles.card}>
		Border becomes narrower at smaller breakpoints. Try it out by resizing the browser window.
	</Box>
);

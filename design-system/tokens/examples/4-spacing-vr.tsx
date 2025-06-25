/**
 * @jsxRuntime classic
 * @jsx jsx
 */

import { cssMap, cx, jsx } from '@atlaskit/css';
import { Box, Inline } from '@atlaskit/primitives/compiled';
import { token } from '@atlaskit/tokens';

import { useVrGlobalTheme } from './utils/use-vr-global-theme';

const styles = cssMap({
	root: {
		height: '200px',
	},
	container: {
		paddingBlockStart: token('space.500'),
	},
	box: {
		backgroundColor: token('color.background.discovery.bold'),
		height: '64px',
		width: '64px',
	},
	'space.negative.400': {
		marginBlockStart: token('space.negative.400'),
	},
	'space.negative.300': {
		marginBlockStart: token('space.negative.300'),
	},
	'space.negative.200': {
		marginBlockStart: token('space.negative.200'),
	},
	'space.negative.150': {
		marginBlockStart: token('space.negative.150'),
	},
	'space.negative.100': {
		marginBlockStart: token('space.negative.100'),
	},
	'space.negative.075': {
		marginBlockStart: token('space.negative.075'),
	},
	'space.negative.050': {
		marginBlockStart: token('space.negative.050'),
	},
	'space.negative.025': {
		marginBlockStart: token('space.negative.025'),
	},
	'space.0': {
		marginBlockStart: token('space.0'),
	},
	'space.025': {
		marginBlockStart: token('space.025'),
	},
	'space.050': {
		marginBlockStart: token('space.050'),
	},
	'space.075': {
		marginBlockStart: token('space.075'),
	},
	'space.100': {
		marginBlockStart: token('space.100'),
	},
	'space.150': {
		marginBlockStart: token('space.150'),
	},
	'space.200': {
		marginBlockStart: token('space.200'),
	},
	'space.300': {
		marginBlockStart: token('space.300'),
	},
	'space.400': {
		marginBlockStart: token('space.400'),
	},
	'space.500': {
		marginBlockStart: token('space.500'),
	},
	'space.600': {
		marginBlockStart: token('space.600'),
	},
	'space.800': {
		marginBlockStart: token('space.800'),
	},
	'space.1000': {
		marginBlockStart: token('space.1000'),
	},
});

export default () => {
	useVrGlobalTheme();
	return (
		<Box testId="spacing" xcss={styles.root}>
			<h1>Spacing scale</h1>
			<Inline space="space.100" xcss={styles.container}>
				<Box xcss={cx(styles.box, styles['space.negative.400'])} />
				<Box xcss={cx(styles.box, styles['space.negative.300'])} />
				<Box xcss={cx(styles.box, styles['space.negative.200'])} />
				<Box xcss={cx(styles.box, styles['space.negative.150'])} />
				<Box xcss={cx(styles.box, styles['space.negative.100'])} />
				<Box xcss={cx(styles.box, styles['space.negative.075'])} />
				<Box xcss={cx(styles.box, styles['space.negative.050'])} />
				<Box xcss={cx(styles.box, styles['space.negative.025'])} />
				<Box xcss={cx(styles.box, styles['space.0'])} />
				<Box xcss={cx(styles.box, styles['space.050'])} />
				<Box xcss={cx(styles.box, styles['space.075'])} />
				<Box xcss={cx(styles.box, styles['space.100'])} />
				<Box xcss={cx(styles.box, styles['space.150'])} />
				<Box xcss={cx(styles.box, styles['space.200'])} />
				<Box xcss={cx(styles.box, styles['space.300'])} />
				<Box xcss={cx(styles.box, styles['space.400'])} />
				<Box xcss={cx(styles.box, styles['space.500'])} />
				<Box xcss={cx(styles.box, styles['space.600'])} />
				<Box xcss={cx(styles.box, styles['space.800'])} />
				<Box xcss={cx(styles.box, styles['space.1000'])} />
			</Inline>
		</Box>
	);
};

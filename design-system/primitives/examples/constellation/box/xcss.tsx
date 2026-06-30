/**
 * @jsxRuntime classic
 * @jsx jsx
 */
import type { JSX } from 'react';

import { cssMap, jsx } from '@atlaskit/css';
import { Box, Stack } from '@atlaskit/primitives/compiled';
import { token } from '@atlaskit/tokens';

const styles = cssMap({
	list: {
		paddingInlineStart: token('space.0'),
	},

	box: {
		color: token('color.text'),
		borderWidth: token('border.width'),
		borderStyle: 'solid',
		borderColor: token('color.border.discovery'),
		paddingBlockStart: token('space.100'),
		paddingInlineEnd: token('space.100'),
		paddingBlockEnd: token('space.100'),
		paddingInlineStart: token('space.100'),
		borderRadius: token('radius.small'),
		transitionDuration: '200ms',
		listStyle: 'none',

		'&::before': {
			content: '"✨"',
			paddingInlineEnd: token('space.050'),
		},

		'&::after': {
			content: '"✨"',
			paddingInlineStart: token('space.050'),
		},

		'&:hover': {
			backgroundColor: token('color.background.discovery.bold.hovered'),
			color: token('color.text.inverse'),
			transform: 'scale(1.02)',
		},
	},
});

export default function Example(): JSX.Element {
	return (
		<Stack as="ul" xcss={styles.list}>
			<Box xcss={styles.box} as="li" backgroundColor="color.background.discovery">
				Hover over me
			</Box>
			<Box xcss={styles.box} as="li">
				Hover over me
			</Box>
			<Box xcss={styles.box} as="li">
				Hover over me
			</Box>
			<Box xcss={styles.box} as="li">
				Hover over me
			</Box>
		</Stack>
	);
}

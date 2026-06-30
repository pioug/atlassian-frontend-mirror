/**
 * @jsxRuntime classic
 * @jsx jsx
 */
import type { JSX } from 'react';

import { jsx } from '@compiled/react';

import { cssMap } from '@atlaskit/css';
import { Anchor } from '@atlaskit/primitives/compiled';
import { token } from '@atlaskit/tokens';

const styles = cssMap({
	root: {
		borderRadius: token('radius.small'),
		color: token('color.text.inverse'),
		display: 'inline-block',

		backgroundColor: token('color.background.brand.bold'),
		paddingBlockStart: token('space.100'),
		paddingInlineEnd: token('space.100'),
		paddingBlockEnd: token('space.100'),
		paddingInlineStart: token('space.100'),

		'&:hover': {
			color: token('color.text.inverse'),
		},
	},
});

export default function Default(): JSX.Element {
	return (
		<Anchor testId="anchor-styled" href="/home" xcss={styles.root}>
			I am an anchor
		</Anchor>
	);
}

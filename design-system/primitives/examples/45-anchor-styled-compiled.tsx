/**
 * @jsxRuntime classic
 * @jsx jsx
 */
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
		paddingTop: token('space.100'),
		paddingRight: token('space.100'),
		paddingBottom: token('space.100'),
		paddingLeft: token('space.100'),

		'&:hover': {
			color: token('color.text.inverse'),
		},
	},
});

export default function Default() {
	return (
		<Anchor testId="anchor-styled" href="/home" xcss={styles.root}>
			I am an anchor
		</Anchor>
	);
}

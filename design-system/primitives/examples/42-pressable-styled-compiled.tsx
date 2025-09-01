/**
 * @jsxRuntime classic
 * @jsx jsx
 */
import { jsx } from '@compiled/react';

import { cssMap } from '@atlaskit/css';
import { Pressable } from '@atlaskit/primitives/compiled';
import { token } from '@atlaskit/tokens';

const styles = cssMap({
	root: {
		borderRadius: token('radius.small'),
		color: token('color.text.inverse'),
		backgroundColor: token('color.background.brand.bold'),
		paddingTop: token('space.100'),
		paddingRight: token('space.100'),
		paddingBottom: token('space.100'),
		paddingLeft: token('space.100'),
	},
});

export default function Styled() {
	return (
		<Pressable testId="pressable-styled" xcss={styles.root}>
			Press me
		</Pressable>
	);
}

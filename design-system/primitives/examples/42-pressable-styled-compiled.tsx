/**
 * @jsxRuntime classic
 * @jsx jsx
 */
import { jsx } from '@compiled/react';

import { cssMap } from '@atlaskit/css';
import { token } from '@atlaskit/tokens';

import { Pressable } from '../src/compiled';

const styles = cssMap({
	root: {
		borderRadius: token('border.radius.100'),
		color: token('color.text.inverse'),
		background: token('color.background.brand.bold'),
		padding: token('space.100'),
	},
});

export default function Styled() {
	return (
		<Pressable testId="pressable-styled" xcss={styles.root}>
			Press me
		</Pressable>
	);
}

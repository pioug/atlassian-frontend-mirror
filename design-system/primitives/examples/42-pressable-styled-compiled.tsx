/**
 * @jsxRuntime classic
 * @jsx jsx
 */
import type { JSX } from 'react';

import { jsx } from '@compiled/react';

import { cssMap } from '@atlaskit/css';
import { Pressable } from '@atlaskit/primitives/compiled';
import { token } from '@atlaskit/tokens';

const styles = cssMap({
	root: {
		borderRadius: token('radius.small'),
		color: token('color.text.inverse'),
		backgroundColor: token('color.background.brand.bold'),
		paddingBlockStart: token('space.100'),
		paddingInlineEnd: token('space.100'),
		paddingBlockEnd: token('space.100'),
		paddingInlineStart: token('space.100'),
	},
});

export default function Styled(): JSX.Element {
	return (
		<Pressable testId="pressable-styled" xcss={styles.root}>
			Press me
		</Pressable>
	);
}

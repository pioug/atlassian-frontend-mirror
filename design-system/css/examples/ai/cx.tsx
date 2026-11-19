/**
 * @jsxRuntime classic
 * @jsx jsx
 */
import type { JSX } from 'react';

import { cssMap, cx, jsx } from '@atlaskit/css';
import { Box } from '@atlaskit/primitives/compiled/box';
import { token } from '@atlaskit/tokens';

const styles = cssMap({
	container: {
		display: 'inline-block',
	},
	block: {
		paddingBlock: token('space.100'),
	},
	inline: {
		paddingInline: token('space.100'),
	},
});

export default function CxExample({
	hasBlock = true,
	hasInline = true,
}: {
	hasBlock?: boolean;
	hasInline?: boolean;
} = {}): JSX.Element {
	return (
		<Box xcss={cx(styles.container, hasBlock && styles.block, hasInline && styles.inline)}>
			Container
			<div css={[styles.inline, styles.block]}>Native elements use a css array</div>
		</Box>
	);
}

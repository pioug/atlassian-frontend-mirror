/**
 * @jsxRuntime classic
 * @jsx jsx
 */
import { Fragment, type JSX } from 'react';

import { cssMap, jsx } from '@atlaskit/css';
import { Box } from '@atlaskit/primitives/compiled/box';
import { token } from '@atlaskit/tokens';

const styles = cssMap({
	container: {
		display: 'inline-block',
		paddingBlockStart: token('space.100'),
		paddingInlineEnd: token('space.100'),
		paddingBlockEnd: token('space.100'),
		paddingInlineStart: token('space.100'),
	},
});

export default function CssMapExample(): JSX.Element {
	return (
		<Fragment>
			<div css={styles.container}>Container contents</div>
			<Box xcss={styles.container}>Container contents</Box>
		</Fragment>
	);
}

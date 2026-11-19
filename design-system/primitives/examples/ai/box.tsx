/**
 * @jsxRuntime classic
 * @jsx jsx
 */
import { Fragment, type JSX } from 'react';

import { cssMap, jsx } from '@atlaskit/css';
import { Box } from '@atlaskit/primitives/compiled/box';
import { token } from '@atlaskit/tokens';

const styles = cssMap({
	box: {
		paddingBlockStart: token('space.200'),
		paddingInlineEnd: token('space.200'),
		paddingBlockEnd: token('space.200'),
		paddingInlineStart: token('space.200'),
		backgroundColor: token('color.background.neutral.subtle'),
	},
});

export default function BoxExample(): JSX.Element {
	return (
		<Fragment>
			<Box padding="space.200" backgroundColor="color.background.neutral.subtle">
				Basic box
			</Box>
			<Box xcss={styles.box}>Styled box</Box>
		</Fragment>
	);
}

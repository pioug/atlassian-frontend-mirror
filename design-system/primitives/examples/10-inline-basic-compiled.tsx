/**
 * @jsxRuntime classic
 * @jsx jsx
 */
import { jsx } from '@compiled/react';

import { cssMap } from '@atlaskit/css';
import { Box, Inline } from '@atlaskit/primitives/compiled';
import { token } from '@atlaskit/tokens';

const styles = cssMap({
	block: {
		borderRadius: token('radius.xsmall'),
		paddingTop: token('space.200'),
		paddingRight: token('space.200'),
		paddingBottom: token('space.200'),
		paddingLeft: token('space.200'),
	},
	container: {
		paddingTop: token('space.100'),
		paddingRight: token('space.100'),
		paddingBottom: token('space.100'),
		paddingLeft: token('space.100'),
	},
});

export default () => (
	<div data-testid="inline-example" css={styles.container}>
		<Inline>
			<Box xcss={styles.block} backgroundColor="color.background.discovery.bold" />
			<Box xcss={styles.block} backgroundColor="color.background.discovery.bold" />
		</Inline>
	</div>
);

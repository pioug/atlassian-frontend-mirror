/**
 * @jsxRuntime classic
 * @jsx jsx
 */
import { jsx } from '@compiled/react';

import { cssMap } from '@atlaskit/css';
import { Box, Stack } from '@atlaskit/primitives/compiled';
import { token } from '@atlaskit/tokens';

const styles = cssMap({
	container: {
		display: 'flex',
		paddingTop: token('space.100'),
		paddingRight: token('space.100'),
		paddingBottom: token('space.100'),
		paddingLeft: token('space.100'),
	},
	surface: {
		borderRadius: token('radius.xsmall'),
		paddingTop: token('space.200'),
		paddingRight: token('space.200'),
		paddingBottom: token('space.200'),
		paddingLeft: token('space.200'),
	},
});

export default function StackBasicCompiled(): JSX.Element {
	return (
		<div data-testid="stack-example" css={styles.container}>
			<Stack>
				<Box xcss={styles.surface} backgroundColor="color.background.discovery.bold" />
				<Box xcss={styles.surface} backgroundColor="color.background.discovery.bold" />
			</Stack>
		</div>
	);
}

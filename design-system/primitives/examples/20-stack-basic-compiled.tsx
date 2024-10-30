/**
 * @jsxRuntime classic
 * @jsx jsx
 */
import { jsx } from '@compiled/react';

import { cssMap } from '@atlaskit/css';
import { token } from '@atlaskit/tokens';

import { Box, Stack } from '../src/compiled';

const styles = cssMap({
	container: { display: 'flex', padding: token('space.100') },
	surface: {
		borderRadius: token('border.radius.050'),
		padding: token('space.200'),
	},
});

export default function StackBasicCompiled() {
	return (
		<div data-testid="stack-example" css={styles.container}>
			<Stack>
				<Box xcss={styles.surface} backgroundColor="color.background.discovery.bold" />
				<Box xcss={styles.surface} backgroundColor="color.background.discovery.bold" />
			</Stack>
		</div>
	);
}

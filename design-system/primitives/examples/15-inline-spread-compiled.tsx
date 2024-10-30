/**
 * @jsxRuntime classic
 * @jsx jsx
 */
import { jsx } from '@compiled/react';

import { cssMap } from '@atlaskit/css';
import { token } from '@atlaskit/tokens';

import { Box, Inline, Stack } from '../src/compiled';

const styles = cssMap({
	wrapper: { display: 'flex', padding: token('space.100') },
	container: {
		borderRadius: token('border.radius.050'),
		padding: token('space.050'),
		width: '200px',
	},
	block: { borderRadius: token('border.radius.050'), padding: token('space.200') },
});

export default () => (
	<div data-testid="inline-example" css={styles.wrapper}>
		<Stack alignInline="center">
			space-between
			<Box xcss={styles.container} backgroundColor="color.background.neutral">
				<Inline space="space.200" spread="space-between">
					<Box xcss={styles.block} backgroundColor="color.background.discovery.bold" />
					<Box xcss={styles.block} backgroundColor="color.background.discovery.bold" />
					<Box xcss={styles.block} backgroundColor="color.background.discovery.bold" />
				</Inline>
			</Box>
		</Stack>
	</div>
);

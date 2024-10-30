/**
 * @jsxRuntime classic
 * @jsx jsx
 */
import { jsx } from '@compiled/react';

import { cssMap } from '@atlaskit/css';
import { token } from '@atlaskit/tokens';

import { Box, Inline, Stack } from '../src/compiled';

const growItems = ['hug', 'fill'] as const;

const styles = cssMap({
	wrapper: {
		padding: token('space.100'),
		display: 'flex',
	},
	container: {
		display: 'flex',
		borderRadius: token('border.radius.050'),
		height: '192px',
	},
	box: { borderRadius: token('border.radius.050'), padding: token('space.200') },
});

export default () => (
	<div data-testid="stack-example" css={styles.wrapper}>
		<Inline space="space.100">
			{growItems.map((grow) => (
				<Stack alignInline="center">
					{grow}
					<Box backgroundColor="color.background.neutral" xcss={styles.container}>
						<Stack grow={grow}>
							<Inline alignBlock="stretch" space="space.100" grow={grow}>
								<Box xcss={styles.box} backgroundColor="color.background.discovery.bold" />
								<Box xcss={styles.box} backgroundColor="color.background.discovery.bold" />
								<Box xcss={styles.box} backgroundColor="color.background.discovery.bold" />
							</Inline>
						</Stack>
					</Box>
				</Stack>
			))}
		</Inline>
	</div>
);

/**
 * @jsxRuntime classic
 * @jsx jsx
 */
import { jsx } from '@compiled/react';

import { cssMap, cx } from '@atlaskit/css';
import { Box, Inline, Stack } from '@atlaskit/primitives/compiled';
import { token } from '@atlaskit/tokens';

const alignBlockItems = ['start', 'center', 'end', 'baseline', 'stretch', undefined] as const;

const styles = cssMap({
	wrapper: { padding: token('space.100') },
	container: {
		display: 'flex',
		borderRadius: token('border.radius.050'),
		padding: token('space.050'),
		height: '192px',
	},
	block: { borderRadius: token('border.radius.050'), padding: token('space.200') },
	blockLarge: { padding: token('space.300') },
});

export default () => (
	<div data-testid="inline-example" css={styles.wrapper}>
		<Inline space="space.200">
			{alignBlockItems.map((alignBlock) => (
				<Stack key={alignBlock} alignInline="center" space="space.025">
					{alignBlock ?? '(default)'}
					<Box backgroundColor="color.background.neutral" xcss={styles.container}>
						<Inline space="space.050" alignBlock={alignBlock}>
							<Box
								xcss={cx(styles.block, styles.blockLarge)}
								backgroundColor="color.background.discovery.bold"
							/>
							<Box xcss={styles.block} backgroundColor="color.background.discovery.bold" />
							<Box xcss={styles.block} backgroundColor="color.background.discovery.bold" />
						</Inline>
					</Box>
				</Stack>
			))}
		</Inline>
	</div>
);

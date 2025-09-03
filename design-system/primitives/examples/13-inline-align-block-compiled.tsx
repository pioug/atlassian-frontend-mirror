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
	wrapper: {
		paddingTop: token('space.100'),
		paddingRight: token('space.100'),
		paddingBottom: token('space.100'),
		paddingLeft: token('space.100'),
	},
	container: {
		display: 'flex',
		borderRadius: token('radius.xsmall'),
		paddingTop: token('space.050'),
		paddingRight: token('space.050'),
		paddingBottom: token('space.050'),
		paddingLeft: token('space.050'),
		height: '192px',
	},
	block: {
		borderRadius: token('radius.xsmall'),
		paddingTop: token('space.200'),
		paddingRight: token('space.200'),
		paddingBottom: token('space.200'),
		paddingLeft: token('space.200'),
	},
	blockLarge: {
		paddingTop: token('space.300'),
		paddingRight: token('space.300'),
		paddingBottom: token('space.300'),
		paddingLeft: token('space.300'),
	},
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

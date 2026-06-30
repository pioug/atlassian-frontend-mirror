/**
 * @jsxRuntime classic
 * @jsx jsx
 */
import type { JSX } from 'react';

import { jsx } from '@compiled/react';

import { cssMap, cx } from '@atlaskit/css';
import { Box, Inline, Stack } from '@atlaskit/primitives/compiled';
import { token } from '@atlaskit/tokens';

const alignBlockItems = ['start', 'center', 'end', 'baseline', 'stretch', undefined] as const;

const styles = cssMap({
	wrapper: {
		paddingBlockStart: token('space.100'),
		paddingInlineEnd: token('space.100'),
		paddingBlockEnd: token('space.100'),
		paddingInlineStart: token('space.100'),
	},
	container: {
		display: 'flex',
		borderRadius: token('radius.xsmall'),
		paddingBlockStart: token('space.050'),
		paddingInlineEnd: token('space.050'),
		paddingBlockEnd: token('space.050'),
		paddingInlineStart: token('space.050'),
		height: '192px',
	},
	block: {
		borderRadius: token('radius.xsmall'),
		paddingBlockStart: token('space.200'),
		paddingInlineEnd: token('space.200'),
		paddingBlockEnd: token('space.200'),
		paddingInlineStart: token('space.200'),
	},
	blockLarge: {
		paddingBlockStart: token('space.300'),
		paddingInlineEnd: token('space.300'),
		paddingBlockEnd: token('space.300'),
		paddingInlineStart: token('space.300'),
	},
});

export default (): JSX.Element => (
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

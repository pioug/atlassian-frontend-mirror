/**
 * @jsxRuntime classic
 * @jsx jsx
 */
import type { JSX } from 'react';

import { jsx } from '@compiled/react';

import { cssMap, cx } from '@atlaskit/css';
import { Box, Inline, Stack } from '@atlaskit/primitives/compiled';
import { token } from '@atlaskit/tokens';

const styles = cssMap({
	container: {
		paddingBlockStart: token('space.100'),
		paddingInlineEnd: token('space.100'),
		paddingBlockEnd: token('space.100'),
		paddingInlineStart: token('space.100'),
	},
	fixedContainer: { maxWidth: '300px' },
	block: {
		borderRadius: token('radius.xsmall'),
		paddingBlockStart: token('space.050'),
		paddingInlineEnd: token('space.050'),
		paddingBlockEnd: token('space.050'),
		paddingInlineStart: token('space.050'),
	},
	blockSparse: {
		paddingBlockStart: token('space.200'),
		paddingInlineEnd: token('space.200'),
		paddingBlockEnd: token('space.200'),
		paddingInlineStart: token('space.200'),
	},
});

export default (): JSX.Element => (
	<div data-testid="inline-example" css={styles.container}>
		<div css={styles.fixedContainer}>
			<Stack space="space.200">
				<div>
					true
					<Box xcss={styles.block} backgroundColor="color.background.neutral">
						<Inline space="space.200" shouldWrap={true}>
							{[...Array(25)].map((_, index) => (
								<Box
									key={index}
									xcss={cx(styles.block, styles.blockSparse)}
									backgroundColor="color.background.discovery.bold"
								/>
							))}
						</Inline>
					</Box>
				</div>
				<div>
					false
					<Box xcss={styles.block} backgroundColor="color.background.neutral">
						<Inline space="space.200" shouldWrap={false}>
							{[...Array(25)].map((_, index) => (
								<Box
									key={index}
									xcss={cx(styles.block, styles.blockSparse)}
									backgroundColor="color.background.discovery.bold"
								/>
							))}
						</Inline>
					</Box>
				</div>
			</Stack>
		</div>
	</div>
);

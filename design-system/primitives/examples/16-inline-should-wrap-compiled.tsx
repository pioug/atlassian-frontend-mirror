/**
 * @jsxRuntime classic
 * @jsx jsx
 */
import { jsx } from '@compiled/react';

import { cssMap, cx } from '@atlaskit/css';
import { Box, Inline, Stack } from '@atlaskit/primitives/compiled';
import { token } from '@atlaskit/tokens';

const styles = cssMap({
	container: { padding: token('space.100') },
	fixedContainer: { maxWidth: '300px' },
	block: { borderRadius: token('border.radius.050'), padding: token('space.050') },
	blockSparse: { padding: token('space.200') },
});

export default () => (
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

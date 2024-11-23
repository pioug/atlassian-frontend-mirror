/**
 * @jsxRuntime classic
 * @jsx jsx
 */
import { jsx } from '@compiled/react';

import { cssMap } from '@atlaskit/css';
import { Box, Inline, Stack } from '@atlaskit/primitives/compiled';
import { token } from '@atlaskit/tokens';

const growItems = ['hug', 'fill'] as const;

const styles = cssMap({
	truncate: {
		overflow: 'hidden',
		textOverflow: 'ellipsis',
		whiteSpace: 'nowrap',
	},
	truncateContainer: { maxWidth: '200px' },
	container: { width: '200px' },
	block: { borderRadius: token('border.radius.050'), padding: token('space.200') },
});

export default () => (
	<Stack testId="inline-example" space="space.100" alignInline="start">
		<Stack space="space.100">
			{growItems.map((grow) => (
				<Stack alignInline="center">
					{grow}
					<Box xcss={styles.container} backgroundColor="color.background.neutral">
						<Inline grow={grow}>
							<Stack space="space.100" grow={grow}>
								<Box xcss={styles.block} backgroundColor="color.background.discovery.bold" />
								<Box xcss={styles.block} backgroundColor="color.background.discovery.bold" />
								<Box xcss={styles.block} backgroundColor="color.background.discovery.bold" />
							</Stack>
						</Inline>
					</Box>
				</Stack>
			))}
		</Stack>

		<Stack space="space.100">
			width=100% enables truncation
			{/* eslint-disable-next-line @atlaskit/ui-styling-standard/enforce-style-prop -- Ignored via go/DSP-18766 */}
			<Box xcss={styles.truncateContainer} backgroundColor="color.background.neutral">
				<Inline grow="fill">
					<Stack space="space.100" grow="fill">
						<span css={styles.truncate}>
							Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor
							incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud
							exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure
							dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur.
							Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt
							mollit anim id est laborum
						</span>
					</Stack>
				</Inline>
			</Box>
		</Stack>
	</Stack>
);

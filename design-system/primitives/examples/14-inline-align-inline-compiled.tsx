/**
 * @jsxRuntime classic
 * @jsx jsx
 */
import { jsx } from '@compiled/react';

import { cssMap } from '@atlaskit/css';
import { Box, Inline, Stack } from '@atlaskit/primitives/compiled';
import { token } from '@atlaskit/tokens';

const styles = cssMap({
	wrapper: {
		paddingTop: token('space.100'),
		paddingRight: token('space.100'),
		paddingBottom: token('space.100'),
		paddingLeft: token('space.100'),
	},
	container: {
		borderRadius: token('border.radius.050'),
		paddingTop: token('space.050'),
		paddingRight: token('space.050'),
		paddingBottom: token('space.050'),
		paddingLeft: token('space.050'),
		width: '200px',
	},
	block: {
		borderRadius: token('border.radius.050'),
		paddingTop: token('space.200'),
		paddingRight: token('space.200'),
		paddingBottom: token('space.200'),
		paddingLeft: token('space.200'),
	},
});

const alignInlineItems = ['start', 'center', 'end'] as const;

export default () => (
	<div data-testid="inline-example" css={styles.wrapper}>
		<Inline space="space.100">
			{alignInlineItems.map((alignInline) => (
				<Stack key={alignInline} alignInline="center">
					{alignInline}
					<Box xcss={styles.container} backgroundColor="color.background.neutral">
						<Inline alignInline={alignInline} space="space.050">
							<Box xcss={styles.block} backgroundColor="color.background.discovery.bold" />
							<Box xcss={styles.block} backgroundColor="color.background.discovery.bold" />
							<Box xcss={styles.block} backgroundColor="color.background.discovery.bold" />
						</Inline>
					</Box>
				</Stack>
			))}
		</Inline>
	</div>
);

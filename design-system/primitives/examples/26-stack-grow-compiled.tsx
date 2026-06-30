/**
 * @jsxRuntime classic
 * @jsx jsx
 */
import type { JSX } from 'react';

import { jsx } from '@compiled/react';

import { cssMap } from '@atlaskit/css';
import { Box, Inline, Stack } from '@atlaskit/primitives/compiled';
import { token } from '@atlaskit/tokens';

const growItems = ['hug', 'fill'] as const;

const styles = cssMap({
	wrapper: {
		paddingBlockStart: token('space.100'),
		paddingInlineEnd: token('space.100'),
		paddingBlockEnd: token('space.100'),
		paddingInlineStart: token('space.100'),
		display: 'flex',
	},
	container: {
		display: 'flex',
		borderRadius: token('radius.xsmall'),
		height: '192px',
	},
	box: {
		borderRadius: token('radius.xsmall'),
		paddingBlockStart: token('space.200'),
		paddingInlineEnd: token('space.200'),
		paddingBlockEnd: token('space.200'),
		paddingInlineStart: token('space.200'),
	},
});

export default (): JSX.Element => (
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

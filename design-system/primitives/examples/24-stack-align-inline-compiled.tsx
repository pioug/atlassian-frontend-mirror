/**
 * @jsxRuntime classic
 * @jsx jsx
 */
import type { JSX } from 'react';

import { jsx } from '@compiled/react';

import { cssMap } from '@atlaskit/css';
import { Box, Inline, Stack } from '@atlaskit/primitives/compiled';
import { token } from '@atlaskit/tokens';

const alignInlineItems = ['start', 'center', 'end'] as const;

const styles = cssMap({
	wrapper: {
		paddingBlockStart: token('space.100'),
		paddingInlineEnd: token('space.100'),
		paddingBlockEnd: token('space.100'),
		paddingInlineStart: token('space.100'),
	},
	container: {
		borderRadius: token('radius.xsmall'),
		paddingBlockStart: token('space.050'),
		paddingInlineEnd: token('space.050'),
		paddingBlockEnd: token('space.050'),
		paddingInlineStart: token('space.050'),
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
			{alignInlineItems.map((alignInline) => (
				<Stack key={alignInline} alignInline="center">
					{alignInline}
					<Box
						backgroundColor="color.background.neutral"
						xcss={styles.container}
						style={{
							// eslint-disable-next-line @atlaskit/ui-styling-standard/enforce-style-prop -- Ignored via go/DSP-18766
							width: '200px',
						}}
					>
						<Stack alignInline={alignInline} space="space.050">
							<Box xcss={styles.box} backgroundColor="color.background.discovery.bold" />
							<Box xcss={styles.box} backgroundColor="color.background.discovery.bold" />
							<Box xcss={styles.box} backgroundColor="color.background.discovery.bold" />
						</Stack>
					</Box>
				</Stack>
			))}
		</Inline>
	</div>
);

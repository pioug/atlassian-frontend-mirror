/**
 * @jsxRuntime classic
 * @jsx jsx
 */
import { jsx } from '@compiled/react';

import { cssMap } from '@atlaskit/css';
import { Box, Inline, Stack } from '@atlaskit/primitives/compiled';
import { token } from '@atlaskit/tokens';

const alignInlineItems = ['start', 'center', 'end'] as const;

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
	},
	box: {
		borderRadius: token('border.radius.050'),
		paddingTop: token('space.200'),
		paddingRight: token('space.200'),
		paddingBottom: token('space.200'),
		paddingLeft: token('space.200'),
	},
});

export default () => (
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

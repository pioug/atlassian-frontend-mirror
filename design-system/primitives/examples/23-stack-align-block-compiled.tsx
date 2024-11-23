/**
 * @jsxRuntime classic
 * @jsx jsx
 */
import { jsx } from '@compiled/react';

import { cssMap } from '@atlaskit/css';
import { Box, Inline, Stack } from '@atlaskit/primitives/compiled';
import { token } from '@atlaskit/tokens';

const alignBlockItems = ['start', 'center', 'end', 'stretch'] as const;

const styles = cssMap({
	wrapper: {
		padding: token('space.100'),
	},
	container: {
		display: 'flex',
		borderRadius: token('border.radius.050'),
		padding: token('space.050'),
	},
	box: { borderRadius: token('border.radius.050'), padding: token('space.200') },
});

export default () => (
	<div data-testid="stack-example" css={styles.wrapper}>
		<Inline space="space.200">
			{alignBlockItems.map((alignBlock) => (
				<Stack key={alignBlock} alignInline="center">
					{alignBlock}
					<Box
						backgroundColor="color.background.neutral"
						xcss={styles.container}
						style={{
							// eslint-disable-next-line @atlaskit/ui-styling-standard/enforce-style-prop -- Ignored via go/DSP-18766
							height: '200px',
						}}
					>
						<Stack space="space.050" alignBlock={alignBlock}>
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

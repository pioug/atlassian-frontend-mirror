/**
 * @jsxRuntime classic
 * @jsx jsx
 */
import { jsx } from '@compiled/react';

import { cssMap } from '@atlaskit/css';
import { Box, Stack } from '@atlaskit/primitives/compiled';
import { token } from '@atlaskit/tokens';

const styles = cssMap({
	wrapper: {
		paddingTop: token('space.100'),
		paddingRight: token('space.100'),
		paddingBottom: token('space.100'),
		paddingLeft: token('space.100'),
		display: 'flex',
	},
	container: {
		display: 'flex',
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
		<Stack alignInline="center">
			space-between
			<Box
				backgroundColor="color.background.neutral"
				xcss={styles.container}
				style={{
					// eslint-disable-next-line @atlaskit/ui-styling-standard/enforce-style-prop -- Ignored via go/DSP-18766
					height: '200px',
				}}
			>
				<Stack space="space.200" spread="space-between">
					<Box xcss={styles.box} backgroundColor="color.background.discovery.bold" />
					<Box xcss={styles.box} backgroundColor="color.background.discovery.bold" />
					<Box xcss={styles.box} backgroundColor="color.background.discovery.bold" />
				</Stack>
			</Box>
		</Stack>
	</div>
);

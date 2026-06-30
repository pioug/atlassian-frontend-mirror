/**
 * @jsxRuntime classic
 * @jsx jsx
 */
import type { JSX } from 'react';

import { jsx } from '@compiled/react';

import { cssMap } from '@atlaskit/css';
import { Box, Stack } from '@atlaskit/primitives/compiled';
import { token } from '@atlaskit/tokens';

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

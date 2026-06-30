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
	container: {
		display: 'flex',
		paddingBlockStart: token('space.100'),
		paddingInlineEnd: token('space.100'),
		paddingBlockEnd: token('space.100'),
		paddingInlineStart: token('space.100'),
	},
	surface: {
		borderRadius: token('radius.xsmall'),
		paddingBlockStart: token('space.200'),
		paddingInlineEnd: token('space.200'),
		paddingBlockEnd: token('space.200'),
		paddingInlineStart: token('space.200'),
	},
});

export default function StackBasicCompiled(): JSX.Element {
	return (
		<div data-testid="stack-example" css={styles.container}>
			<Stack>
				<Box xcss={styles.surface} backgroundColor="color.background.discovery.bold" />
				<Box xcss={styles.surface} backgroundColor="color.background.discovery.bold" />
			</Stack>
		</div>
	);
}

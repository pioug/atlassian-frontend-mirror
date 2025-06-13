/**
 * @jsxRuntime classic
 * @jsx jsx
 */
import { useState } from 'react';

import { cssMap, cx, jsx } from '@atlaskit/css';
import { Box, Inline } from '@atlaskit/primitives/compiled';
import Toggle from '@atlaskit/toggle';
import { token } from '@atlaskit/tokens';

const styles = cssMap({
	base: {
		paddingBlock: token('space.500'),
		width: '100%',
		borderRadius: '3px',
	},

	enabled: {
		backgroundColor: token('color.background.accent.green.bolder'),
	},

	disabled: {
		backgroundColor: token('color.background.accent.gray.bolder'),
	},
});

export default function ConditionalStyles() {
	const [isEnabled, setEnabled] = useState(false);

	return (
		<Box testId="example" padding="space.200">
			<Inline alignBlock="center">
				<p>Toggle background color:</p>
				<Toggle onChange={() => setEnabled((current) => !current)} />
			</Inline>
			<Box xcss={cx(styles.base, isEnabled ? styles.enabled : styles.disabled)} />
		</Box>
	);
}

import React from 'react';

import { Box } from '@atlaskit/primitives';
import { token } from '@atlaskit/tokens';

import Button from '../src/new';

export default function AutoFocusExample() {
	return (
		// to capture focus we need the padding
		// eslint-disable-next-line @atlaskit/ui-styling-standard/enforce-style-prop -- Ignored via go/DSP-18766
		<Box testId="button" style={{ padding: token('space.200', '16px') }}>
			<Button appearance="primary" autoFocus>
				Button
			</Button>
		</Box>
	);
}

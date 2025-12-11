import React from 'react';

import Button from '@atlaskit/button/new';
// eslint-disable-next-line @atlaskit/design-system/no-emotion-primitives -- to be migrated to @atlaskit/primitives/compiled – go/akcss
import { Box } from '@atlaskit/primitives';
import { token } from '@atlaskit/tokens';

export default function AutoFocusExample(): React.JSX.Element {
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

import React from 'react';

import Button from '@atlaskit/button';
import { token } from '@atlaskit/tokens';

export default () => (
	// to capture focus we need the padding
	// eslint-disable-next-line @atlaskit/ui-styling-standard/enforce-style-prop -- Ignored via go/DSP-18766
	<div data-testid="button" style={{ padding: token('space.200', '16px') }}>
		<Button appearance="primary" autoFocus>
			Button
		</Button>
	</div>
);

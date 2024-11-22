import React from 'react';

import Button from '@atlaskit/button';
import { token } from '@atlaskit/tokens';

export default () => (
	<Button
		style={{
			// eslint-disable-next-line @atlaskit/ui-styling-standard/enforce-style-prop -- Ignored via go/DSP-18766
			backgroundColor: token('color.background.accent.red.subtle'),
		}}
	>
		Pink button
	</Button>
);

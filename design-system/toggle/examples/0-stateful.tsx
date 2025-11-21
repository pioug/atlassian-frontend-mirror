import React from 'react';

import { Label } from '@atlaskit/form';
import { Stack } from '@atlaskit/primitives/compiled';
import Toggle from '@atlaskit/toggle';

export default (): React.JSX.Element => (
	<Stack>
		<Label htmlFor="regular">Regular</Label>
		<Toggle id="regular" />
		<Label htmlFor="large-checked">Large (checked by default)</Label>
		<Toggle id="large-checked" size="large" defaultChecked />
	</Stack>
);

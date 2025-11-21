import React from 'react';

import { Label } from '@atlaskit/form';
import { Stack } from '@atlaskit/primitives/compiled';
import Toggle from '@atlaskit/toggle';

export default (): React.JSX.Element => (
	<Stack>
		<Label htmlFor="large-default">Large (Default)</Label>
		<Toggle id="large-default" size="large" />
		<Label htmlFor="large-checked">Large (Checked)</Label>
		<Toggle id="large-checked" size="large" defaultChecked />
	</Stack>
);

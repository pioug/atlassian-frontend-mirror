import React from 'react';

import { Label } from '@atlaskit/form';
import { Stack } from '@atlaskit/primitives/compiled';
import Toggle from '@atlaskit/toggle';

export default () => (
	<Stack>
		<Label htmlFor="regular">Regular (Disabled)</Label>
		<Toggle id="regular" isDisabled />
		<Label htmlFor="large">Large (checked by default, disabled)</Label>
		<Toggle id="large" size="large" isDisabled defaultChecked />
	</Stack>
);

import React from 'react';

import { Label } from '@atlaskit/form';
import { Stack } from '@atlaskit/primitives';

import Toggle from '../src';

export default () => (
	<Stack>
		<Label htmlFor="regular">Regular (Checked by default)</Label>
		<Toggle id="regular" isChecked={true} testId={'toggle-button'} />
		<Label htmlFor="large">Large (checked by default)</Label>
		<Toggle id="large" size="large" defaultChecked />
	</Stack>
);

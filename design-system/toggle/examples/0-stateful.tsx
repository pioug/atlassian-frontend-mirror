import React from 'react';

import { Label } from '@atlaskit/form';
import { Stack } from '@atlaskit/primitives';

import Toggle from '../src';

export default () => (
	<Stack>
		<Label htmlFor="regular">Regular</Label>
		<Toggle id="regular" />
		<Label htmlFor="large-checked">Large (checked by default)</Label>
		<Toggle id="large-checked" size="large" defaultChecked />
	</Stack>
);

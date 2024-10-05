import React from 'react';

import { Label } from '@atlaskit/form';
import Heading from '@atlaskit/heading';
import { Box } from '@atlaskit/primitives';

import { DatePicker } from '../src';

export default () => {
	return (
		<Box>
			<Heading size="large">DatePicker</Heading>
			<Label htmlFor="react-select-is-open--input">Always open</Label>
			<DatePicker id="react-select-is-open--input" isOpen />
		</Box>
	);
};

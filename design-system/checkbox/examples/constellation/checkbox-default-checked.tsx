import React from 'react';

import { Box } from '@atlaskit/primitives';

import { Checkbox } from '../../src';

const CheckboxDefaultCheckedExample = () => {
	return (
		<Box>
			Default Checked Checkbox
			<Checkbox
				defaultChecked
				label="Default Checked Checkbox"
				value="Default Checked Checkbox"
				name="default-checked-checkbox"
			/>
		</Box>
	);
};

export default CheckboxDefaultCheckedExample;

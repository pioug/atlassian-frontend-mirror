import React from 'react';

import { Box } from '@atlaskit/primitives';

import { Checkbox } from '../../src';

const CheckboxSizesExample = () => {
	return (
		<Box>
			<Checkbox
				value="Medium checkbox"
				label="Medium checkbox"
				name="checkbox-basic"
				size="medium"
			/>
			<Checkbox
				value="Large checkbox"
				label="Large checkbox"
				name="checkbox-basic"
				size="large"
				defaultChecked
			/>
		</Box>
	);
};

export default CheckboxSizesExample;

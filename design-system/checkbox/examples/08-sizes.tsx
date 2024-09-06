import React from 'react';

import { Checkbox } from '../src';

export default function BasicUsageExample() {
	return (
		<div>
			<Checkbox
				value="Medium checkbox"
				label="Medium checkbox"
				name="checkbox-basic"
				size="medium"
				testId="medium"
			/>
			<Checkbox
				defaultChecked
				value="Large checkbox"
				label="Large checkbox"
				name="checkbox-basic"
				size="large"
				testId="large"
			/>
		</div>
	);
}

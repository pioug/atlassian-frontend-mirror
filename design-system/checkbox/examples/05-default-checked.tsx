import React from 'react';

import { Checkbox } from '@atlaskit/checkbox';

export default function ControlledExample() {
	return (
		<div>
			Default Checked Checkbox
			<Checkbox
				defaultChecked
				label="Default Checked Checkbox"
				value="Default Checked Checkbox"
				name="default-checked-checkbox"
			/>
		</div>
	);
}

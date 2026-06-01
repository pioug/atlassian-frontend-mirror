import React from 'react';

import { Checkbox } from '@atlaskit/checkbox';
import { Box } from '@atlaskit/primitives/compiled';

const CheckboxDefaultCheckedExample = (): React.JSX.Element => {
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

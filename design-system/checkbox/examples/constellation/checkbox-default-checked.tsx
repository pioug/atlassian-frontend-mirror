import React from 'react';

import { Checkbox } from '@atlaskit/checkbox';
// eslint-disable-next-line @atlaskit/design-system/no-emotion-primitives -- to be migrated to @atlaskit/primitives/compiled – go/akcss
import { Box } from '@atlaskit/primitives';

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

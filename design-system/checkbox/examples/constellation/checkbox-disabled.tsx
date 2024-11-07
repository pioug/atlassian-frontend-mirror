import React from 'react';

import { Checkbox } from '@atlaskit/checkbox';

const CheckboxDisabledExample = () => (
	<Checkbox
		isDisabled
		label="Disabled checkbox"
		value="Disabled"
		name="checkbox-disabled"
		testId="cb-disabled"
	/>
);
export default CheckboxDisabledExample;

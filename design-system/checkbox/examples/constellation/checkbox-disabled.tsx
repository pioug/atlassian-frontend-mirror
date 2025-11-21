import React from 'react';

import { Checkbox } from '@atlaskit/checkbox';

const CheckboxDisabledExample = (): React.JSX.Element => (
	<Checkbox
		isDisabled
		label="Disabled checkbox"
		value="Disabled"
		name="checkbox-disabled"
		testId="cb-disabled"
	/>
);
export default CheckboxDisabledExample;

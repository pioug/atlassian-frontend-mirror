import React from 'react';

import { Checkbox } from '@atlaskit/checkbox';

const CheckboxUncontrolledExample = (): React.JSX.Element => (
	<Checkbox
		defaultChecked
		label="Uncontrolled checkbox"
		value="Uncontrolled checkbox"
		name="uncontrolled-checkbox"
	/>
);

export default CheckboxUncontrolledExample;

import React from 'react';

import { Checkbox } from '@atlaskit/checkbox';
import __noop from '@atlaskit/ds-lib/noop';

const CheckboxDefaultExample = () => {
	return (
		<Checkbox
			value="default checkbox"
			label="Default checkbox"
			onChange={__noop}
			name="checkbox-default"
			testId="cb-default"
		/>
	);
};

export default CheckboxDefaultExample;

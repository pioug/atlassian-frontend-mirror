import React from 'react';

import __noop from '@atlaskit/ds-lib/noop';

import { Checkbox } from '../../src';

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

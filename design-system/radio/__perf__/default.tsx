import React from 'react';

import noop from '@atlaskit/ds-lib/noop';

import { Radio } from '../src';

export default () => (
	<Radio
		value="default radio"
		label="Default radio"
		name="radio-default"
		testId="radio-default"
		isChecked={true}
		onChange={noop}
	/>
);

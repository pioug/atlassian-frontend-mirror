/* eslint-disable no-console, import/no-anonymous-default-export */
import React from 'react';

import { RadioGroup } from '@atlaskit/radio';

// Radio group with options
const options = [
	{ name: 'color', value: 'red', label: 'Red' },
	{ name: 'color', value: 'blue', label: 'Blue' },
];

export default () => {
	const [value, setValue] = React.useState('red');
	return (
		<RadioGroup options={options} value={value} onChange={(e) => setValue(e.currentTarget.value)} />
	);
};

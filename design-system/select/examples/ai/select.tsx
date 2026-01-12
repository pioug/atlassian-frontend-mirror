import React from 'react';

import Select from '@atlaskit/select';

const cityOptions = [
	{ label: 'Brisbane', value: 'brisbane' },
	{ label: 'Sydney', value: 'sydney' },
	{ label: 'Melbourne', value: 'melbourne' },
];

const colorOptions = [
	{ label: 'Red', value: 'red' },
	{ label: 'Green', value: 'green' },
	{ label: 'Blue', value: 'blue' },
];

const Examples = (): React.JSX.Element => (
	<>
		<Select options={colorOptions} isMulti placeholder="" />
		<Select options={cityOptions} isSearchable placeholder="" />
	</>
);
export default Examples;

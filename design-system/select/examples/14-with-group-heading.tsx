import React from 'react';

import { Label } from '@atlaskit/form';
import Select from '@atlaskit/select';

const GROUP_OPTIONS = [
	{
		label: 'Group I',
		options: [
			{ label: 'Adelaide', value: 'adelaide' },
			{ label: 'Brisbane', value: 'brisbane' },
		],
	},
	{
		label: 'Group II',
		options: [
			{ label: 'Canberra', value: 'canberra' },
			{ label: 'Darwin', value: 'darwin' },
		],
	},
];

const SingleExample = (): React.JSX.Element => (
	<>
		<Label htmlFor="group-example">Which city do you live in?</Label>
		<Select inputId="group-example" options={GROUP_OPTIONS} placeholder="" />
	</>
);

export default SingleExample;

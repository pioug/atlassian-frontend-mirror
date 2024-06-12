import React from 'react';

import { Label } from '@atlaskit/form';

import Select from '../src';

const SingleExample = () => (
	<>
		<Label htmlFor="is-searchable-false-example">Which city do you live in?</Label>
		<Select
			inputId="is-searchable-false-example"
			options={[
				{ label: 'Adelaide', value: 'adelaide' },
				{ label: 'Brisbane', value: 'brisbane' },
				{ label: 'Canberra', value: 'canberra' },
				{ label: 'Darwin', value: 'darwin' },
				{ label: 'Hobart', value: 'hobart' },
				{ label: 'Melbourne', value: 'melbourne' },
				{ label: 'Perth', value: 'perth' },
				{ label: 'Sydney', value: 'sydney' },
			]}
			isSearchable={false}
			placeholder="Choose a City"
		/>
	</>
);

export default SingleExample;

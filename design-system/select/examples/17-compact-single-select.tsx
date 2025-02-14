import React from 'react';

import { Label } from '@atlaskit/form';
import Select from '@atlaskit/select';

const CompactSingleExample = () => (
	<>
		<Label htmlFor="compact-example">Which city do you live in?</Label>
		<Select
			inputId="compact-example"
			testId="react-select"
			isSearchable
			spacing="compact"
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
			placeholder="Choose a City"
		/>
	</>
);

export default CompactSingleExample;

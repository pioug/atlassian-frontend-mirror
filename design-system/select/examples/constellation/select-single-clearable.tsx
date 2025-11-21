import React from 'react';

import { Label } from '@atlaskit/form';
import Select from '@atlaskit/select';

const SelectSingleClearable = (): React.JSX.Element => (
	<>
		<Label htmlFor="single-select-example-clearable">What city do you live in?</Label>
		<Select
			inputId="single-select-example-clearable"
			testId="react-select"
			isClearable={true}
			clearControlLabel="Clear city"
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
			placeholder="Choose a city"
		/>
	</>
);

export default SelectSingleClearable;

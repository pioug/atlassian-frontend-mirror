import React from 'react';

import { Label } from '@atlaskit/form';
import Select from '@atlaskit/select';

const SelectSingleExample = () => (
	<>
		<Label htmlFor="single-select-example">What city do you live in?</Label>
		<Select
			inputId="single-select-example"
			// eslint-disable-next-line @atlaskit/ui-styling-standard/no-classname-prop -- Ignored via go/DSP-18766
			className="single-select"
			classNamePrefix="react-select"
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

export default SelectSingleExample;

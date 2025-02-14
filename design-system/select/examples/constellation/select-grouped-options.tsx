import React from 'react';

import { Label } from '@atlaskit/form';
import Select from '@atlaskit/select';

const SelectGroupedOptionsExample = () => (
	<>
		<Label htmlFor="grouped-options-example">What city do you live in?</Label>
		<Select
			inputId="grouped-options-example"
			testId="react-select"
			options={[
				{
					label: 'NSW',
					options: [
						{ label: 'Sydney', value: 's' },
						{ label: 'Newcastle', value: 'n' },
					],
				},
				{
					label: 'QLD',
					options: [
						{ label: 'Brisbane', value: 'b' },

						{ label: 'Gold coast', value: 'g' },
					],
				},
				{
					label: 'Other',
					options: [
						{ label: 'Canberra', value: 'c' },
						{ label: 'Williamsdale', value: 'w' },
						{ label: 'Darwin', value: 'd' },
						{ label: 'Perth', value: 'p' },
					],
				},
			]}
			placeholder="Choose a city"
		/>
	</>
);

export default SelectGroupedOptionsExample;

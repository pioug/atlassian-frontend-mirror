import React from 'react';

import { Label } from '@atlaskit/form';
import Select from '@atlaskit/select';

const SelectGroupedOptionsExample = (): React.JSX.Element => (
	<>
		<Label htmlFor="grouped-options-example">What city do you live in?</Label>
		<Select
			inputId="grouped-options-example"
			options={[
				{
					label: 'New South Wales',
					options: [
						{ label: 'Sydney', value: 's' },
						{ label: 'Newcastle', value: 'n' },
					],
				},
				{
					label: 'Queensland',
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
			menuIsOpen
		/>
	</>
);

export default SelectGroupedOptionsExample;

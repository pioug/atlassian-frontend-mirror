import React from 'react';
import { Label } from '@atlaskit/form';
import { RadioSelect } from '../../src';
import { cities } from '../common/data';

const SelectRadioExample = () => (
	<>
		<Label htmlFor="radio-select-example">What city do you live in?</Label>
		<RadioSelect
			inputId="radio-select-example"
			// eslint-disable-next-line @atlaskit/ui-styling-standard/no-classname-prop -- Ignored via go/DSP-18766
			className="radio-select"
			classNamePrefix="react-select"
			options={[
				...cities,
				{
					label: "Super long name that no one will ever read because it's way too long",
					value: 'test',
				},
			]}
			placeholder="Choose a city"
		/>
	</>
);

export default SelectRadioExample;

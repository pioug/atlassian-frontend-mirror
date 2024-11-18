import React from 'react';

import { Label } from '@atlaskit/form';
import { CheckboxSelect } from '@atlaskit/select';

import { cities } from '../common/data';

const SelectCheckboxExample = () => (
	<>
		<Label htmlFor="checkbox-select-example">What cities have you lived in?</Label>
		<CheckboxSelect
			inputId="checkbox-select-example"
			// eslint-disable-next-line @atlaskit/ui-styling-standard/no-classname-prop -- Ignored via go/DSP-18766
			className="checkbox-select"
			classNamePrefix="select"
			options={[
				...cities,
				{
					label:
						"Super long name that no one will ever read because it's way too long to be a realistic option but it will highlight the flexbox grow and shrink styles",
					value: 'test',
				},
			]}
			placeholder="Choose a city"
		/>
	</>
);

export default SelectCheckboxExample;

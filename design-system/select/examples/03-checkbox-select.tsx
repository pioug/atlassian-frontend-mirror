import React from 'react';

import { Label } from '@atlaskit/form';
import { CheckboxSelect } from '@atlaskit/select';

import { cities } from './common/data';

// data imported for brevity; equal to the options from Single Select example
const CheckboxExample = () => (
	<>
		<Label htmlFor="checkbox-select-example">Which cities have you lived in?</Label>
		<CheckboxSelect
			inputId="checkbox-select-example"
			// eslint-disable-next-line @atlaskit/ui-styling-standard/no-classname-prop -- Ignored via go/DSP-18766
			className="checkbox-select"
			classNamePrefix="select"
			options={[
				...cities,
				{
					label:
						"super long name that no one will ever read because it's way too long to be a realistic option but it will highlight the flexbox grow and shrink styles",
					value: 'test',
				},
			]}
			placeholder="Choose a City"
		/>

		<Label htmlFor="checkbox-select-example">Which cities have you lived in? (Selected)</Label>
		<CheckboxSelect
			inputId="checkbox-select-example"
			// eslint-disable-next-line @atlaskit/ui-styling-standard/no-classname-prop -- Ignored via go/DSP-18766
			className="checkbox-select"
			classNamePrefix="select"
			menuIsOpen
			options={[
				...cities,
				{
					label:
						"super long name that no one will ever read because it's way too long to be a realistic option but it will highlight the flexbox grow and shrink styles",
					value: 'test',
				},
			]}
			defaultValue={cities[4]}
			placeholder="Choose a City (Selected)"
		/>
	</>
);

export default CheckboxExample;

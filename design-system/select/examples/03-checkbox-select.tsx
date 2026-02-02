import React from 'react';

import { Label } from '@atlaskit/form';
import { CheckboxSelect } from '@atlaskit/select';

import { cities } from './common/data';

// data imported for brevity; equal to the options from Single Select example
const CheckboxExample = (): React.JSX.Element => (
	<>
		<Label htmlFor="checkbox-select-example">Which cities have you lived in?</Label>
		{/* eslint-disable-next-line @atlaskit/design-system/no-placeholder */}
		<CheckboxSelect
			inputId="checkbox-select-example"
			testId="react-select"
			options={[
				...cities,
				{
					label:
						"super long name that no one will ever read because it's way too long to be a realistic option but it will highlight the flexbox grow and shrink styles",
					value: 'test',
				},
			]}
			placeholder=""
		/>

		<Label htmlFor="checkbox-selected-example">Which cities have you lived in? (Selected)</Label>
		{/* eslint-disable-next-line @atlaskit/design-system/no-placeholder */}
		<CheckboxSelect
			inputId="checkbox-selected-example"
			testId="react-selected"
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
			placeholder=""
		/>
	</>
);

export default CheckboxExample;

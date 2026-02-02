import React from 'react';

import { Label } from '@atlaskit/form';
import { RadioSelect } from '@atlaskit/select';

import { cities } from './common/data';

// data imported for brevity; equal to the options from Single Select example
const RadioExample = (): React.JSX.Element => (
	<>
		<Label htmlFor="radio-select-example">What city do you live in?</Label>
		{/* eslint-disable-next-line @atlaskit/design-system/no-placeholder */}
		<RadioSelect
			inputId="radio-select-example"
			testId="react-select"
			options={[
				...cities,
				{
					label: "super long name that noone will ever read because it's way too long",
					value: 'test',
				},
			]}
			placeholder=""
		/>
	</>
);

export default RadioExample;

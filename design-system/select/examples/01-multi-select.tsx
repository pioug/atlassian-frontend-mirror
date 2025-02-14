import React from 'react';

import { Label } from '@atlaskit/form';
import Select from '@atlaskit/select';

import { cities } from './common/data';

// data imported for brevity; equal to the options from Single Select example
const MultiExample = () => (
	<>
		<Label htmlFor="multi-select-example">What cities have you lived in?</Label>
		<Select
			inputId="multi-select-example"
			testId="react-select"
			options={cities}
			isMulti
			isSearchable={false}
			placeholder="Choose a City"
		/>
	</>
);

export default MultiExample;

import React from 'react';

import { Label } from '@atlaskit/form';
import Select, { type OptionsType } from '@atlaskit/select';

import { cities } from './common/data';

// you control how the options are filtered
const filter = (inputValue: string) =>
	cities.filter((i) => i.label.toLowerCase().includes(inputValue.toLowerCase()));

// async load function using callback (promises also supported)
const loadOptions = (inputValue: string, callback: (options: OptionsType) => void) => {
	setTimeout(() => {
		callback(filter(inputValue));
	}, 1000);
};

const AsyncExample = (): React.JSX.Element => (
	<>
		<Label htmlFor="async-select-with-callback-example">Which country do you live in?</Label>
		{/* eslint-disable-next-line @atlaskit/design-system/no-placeholder */}
		<Select
			inputId="async-select-with-callback-example"
			testId="react-select"
			defaultOptions
			loadOptions={loadOptions}
			placeholder=""
		/>
	</>
);

export default AsyncExample;

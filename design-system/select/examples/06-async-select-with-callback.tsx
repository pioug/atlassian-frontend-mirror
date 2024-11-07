import React from 'react';

import { Label } from '@atlaskit/form';

import Select from '../src';
import { type OptionsType } from '../src/types';

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

const AsyncExample = () => (
	<>
		<Label htmlFor="async-select-with-callback-example">Which country do you live in?</Label>
		<Select
			inputId="async-select-with-callback-example"
			// eslint-disable-next-line @atlaskit/ui-styling-standard/no-classname-prop -- Ignored via go/DSP-18766
			className="async-select-with-callback"
			classNamePrefix="react-select"
			defaultOptions
			loadOptions={loadOptions}
			placeholder="Choose a City"
		/>
	</>
);

export default AsyncExample;

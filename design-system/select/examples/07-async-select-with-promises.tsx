import React from 'react';

import { Label } from '@atlaskit/form';
import Select, { type OptionsType } from '@atlaskit/select';

import { cities } from './common/data';

const filterCities = (inputValue: string) =>
	cities.filter((i) => i.label.toLowerCase().includes(inputValue.toLowerCase()));

const promiseOptions = (inputValue: string) =>
	new Promise<OptionsType>((resolve) => {
		setTimeout(() => {
			resolve(filterCities(inputValue));
		}, 1000);
	});
const WithPromises = (): React.JSX.Element => (
	<>
		<Label htmlFor="async-example">Which country do you live in?</Label>
		<Select inputId="async-example" cacheOptions defaultOptions loadOptions={promiseOptions} />
	</>
);

export default WithPromises;

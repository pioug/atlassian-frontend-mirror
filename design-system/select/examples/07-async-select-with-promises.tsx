import React from 'react';

import { Label } from '@atlaskit/form';

import { cities } from './common/data';
import { AsyncSelect, type OptionsType } from '../src';

const filterCities = (inputValue: string) =>
	cities.filter((i) => i.label.toLowerCase().includes(inputValue.toLowerCase()));

const promiseOptions = (inputValue: string) =>
	new Promise<OptionsType>((resolve) => {
		setTimeout(() => {
			resolve(filterCities(inputValue));
		}, 1000);
	});
const WithPromises = () => (
	<>
		<Label htmlFor="async-example">Which country do you live in?</Label>
		<AsyncSelect inputId="async-example" cacheOptions defaultOptions loadOptions={promiseOptions} />
	</>
);

export default WithPromises;

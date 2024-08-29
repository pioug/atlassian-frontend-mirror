import React from 'react';

import { Label } from '@atlaskit/form';

import AsyncSelect from '../src/async';

import { cities } from './common/data';

const filterCities = (inputValue: string) =>
	cities.filter((i: { label: string }) => i.label.toLowerCase().includes(inputValue.toLowerCase()));

const promiseOptions = (inputValue: string) =>
	new Promise<any>((resolve) => {
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

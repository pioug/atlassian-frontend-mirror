import React from 'react';

import { Label } from '@atlaskit/form/label/default';
import AsyncSelect from '@atlaskit/select/async-select';
import { type OptionsType } from '@atlaskit/select/types';

import { cities } from '../common/data';

const filterCities = (inputValue: string) =>
	cities.filter((i) => i.label.toLowerCase().includes(inputValue.toLowerCase()));

const promiseOptions = (inputValue: string) =>
	new Promise<OptionsType>((resolve) => {
		setTimeout(() => {
			resolve(filterCities(inputValue));
		}, 1000);
	});

const WithPromises = () => {
	return (
		<>
			<Label htmlFor="async-select-example">What city do you live in?</Label>
			<AsyncSelect
				inputId="async-select-example"
				cacheOptions
				defaultOptions
				loadOptions={promiseOptions}
			/>
		</>
	);
};

export default (): React.JSX.Element => <WithPromises />;

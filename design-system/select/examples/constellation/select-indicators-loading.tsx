import React from 'react';

import { Label } from '@atlaskit/form/label/default';
import Select from '@atlaskit/select/default';
import type { OptionType } from '@atlaskit/select/types';

import { cities } from '../common/data';

const filterCities = (inputValue: string) =>
	cities.filter((i) => i.label.toLowerCase().includes(inputValue.toLowerCase()));

const promiseOptions = (inputValue: string) =>
	new Promise<OptionType[]>((resolve) => {
		setTimeout(() => {
			resolve(filterCities(inputValue));
		}, 1000);
	});

export default (): React.JSX.Element => {
	return (
		<>
			<Label htmlFor="indicators-loading">What city do you live in?</Label>
			<Select
				inputId="indicators-loading"
				cacheOptions
				defaultOptions
				loadOptions={promiseOptions}
			/>
		</>
	);
};

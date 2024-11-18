import React from 'react';

import { Label } from '@atlaskit/form';
import { CountrySelect } from '@atlaskit/select';

const CountrySelectExample = () => (
	<>
		<Label htmlFor="country-select-example">What country do you live in?</Label>
		<CountrySelect inputId="country-select-example" placeholder="Country" />
	</>
);

export default CountrySelectExample;

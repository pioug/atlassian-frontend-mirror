import React from 'react';

import { Label } from '@atlaskit/form/label';
import { CountrySelect } from '@atlaskit/select/country-select';

const CountrySelectExample = (): React.JSX.Element => (
	<>
		<Label htmlFor="country-select-example">What country do you live in?</Label>
		<CountrySelect inputId="country-select-example" placeholder="" />
	</>
);

export default CountrySelectExample;

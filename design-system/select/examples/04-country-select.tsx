import React from 'react';

import { Label } from '@atlaskit/form/label/default';
import { CountrySelect } from '@atlaskit/select/country-select';

const CountryExample = (): React.JSX.Element => (
	<>
		<Label htmlFor="country-select-example">Which country do you live in?</Label>
		<CountrySelect inputId="country-select-example" placeholder="" />
	</>
);

export default CountryExample;

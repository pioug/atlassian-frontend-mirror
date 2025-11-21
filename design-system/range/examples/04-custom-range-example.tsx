import React, { Fragment } from 'react';

import { Label } from '@atlaskit/form';
import Range from '@atlaskit/range';

const CustomValues = (): React.JSX.Element => (
	<Fragment>
		<p id="range-aria-description">
			This range has a minimum of 40, a maximum of 500, a default value of 480 , and a step of 20.
			If you want to experiment with custom values, check out the playground.
		</p>
		<Label htmlFor="range-custom">Custom</Label>
		<Range
			id="range-custom"
			defaultValue={480}
			min={40}
			max={500}
			step={20}
			onChange={(value) => console.log('new value', value)}
			aria-describedby="range-aria-description"
		/>
	</Fragment>
);

export default CustomValues;

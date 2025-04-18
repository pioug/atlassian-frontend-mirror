import React from 'react';

import { Label } from '@atlaskit/form';
import Range from '@atlaskit/range';

const SimpleRange = () => (
	<>
		<Label htmlFor="range-uncontrolled">Uncontrolled</Label>
		<Range
			id="range-uncontrolled"
			testId="range-uncontrolled"
			step={1}
			onChange={(value) => console.log('new value', value)}
		/>
	</>
);

export default SimpleRange;

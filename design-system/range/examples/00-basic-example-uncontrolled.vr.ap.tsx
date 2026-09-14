import React from 'react';

import { Label } from '@atlaskit/form/label/default';
import Range from '@atlaskit/range/range';

const SimpleRange = (): React.JSX.Element => (
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

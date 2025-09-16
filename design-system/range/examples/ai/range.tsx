import React from 'react';

import Range from '@atlaskit/range';

export default [
	<Range
		value={25}
		min={0}
		max={50}
		step={5}
		onChange={(value) => console.log('Stepped value:', value)}
	/>,
];

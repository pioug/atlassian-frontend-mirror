import React from 'react';

import Range from '@atlaskit/range';

const _default_1: React.JSX.Element[] = [
	<Range
		value={25}
		min={0}
		max={50}
		step={5}
		onChange={(value) => console.log('Stepped value:', value)}
	/>,
];
export default _default_1;

import React from 'react';

import Range from '../../src';

const RangeUncontrolledExample = () => {
	return (
		<Range
			aria-label="uncontrolled range"
			step={1}
			onChange={(value) => console.log('new value', value)}
		/>
	);
};

export default RangeUncontrolledExample;

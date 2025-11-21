import React, { Fragment, useEffect, useState } from 'react';

import { Label } from '@atlaskit/form';
import Range from '@atlaskit/range';

export default (): React.JSX.Element => {
	const [value, setValue] = useState(50);
	const ref = React.createRef<HTMLInputElement>();

	useEffect(() => {
		console.log('new value from ref', ref.current && ref.current.value);
	});

	return (
		<Fragment>
			<Label htmlFor="range-ref">Value by ref</Label>
			<Range
				id="range-ref"
				ref={ref}
				step={1}
				value={value}
				onChange={(value) => setValue(value)}
			/>
			<p>The current value from ref is being logged</p>
		</Fragment>
	);
};

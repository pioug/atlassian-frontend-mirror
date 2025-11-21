import React, { Fragment, useState } from 'react';

import { Label } from '@atlaskit/form';
import Range from '@atlaskit/range';

function ControlledRange(): React.JSX.Element {
	const [value, setValue] = useState(50);

	return (
		<Fragment>
			<Label htmlFor="range-controlled">Controlled</Label>
			<Range id="range-controlled" step={1} value={value} onChange={(value) => setValue(value)} />
			<p>The current value is: {value}</p>
		</Fragment>
	);
}

export default ControlledRange;

import React from 'react';

import { Label } from '@atlaskit/form';
import Range from '@atlaskit/range';

const RangeDefaultExample = (): React.JSX.Element => (
	<>
		<Label htmlFor="range-input">Adjust volume</Label>
		<Range id="range-input" step={1} min={1} max={100} />
	</>
);

export default RangeDefaultExample;

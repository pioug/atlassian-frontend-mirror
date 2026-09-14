import React from 'react';

import { Label } from '@atlaskit/form/label/default';
import Range from '@atlaskit/range/range';

const RangeDefaultExample = (): React.JSX.Element => (
	<>
		<Label htmlFor="range-input">Adjust volume</Label>
		<Range id="range-input" step={1} min={1} max={100} />
	</>
);

export default RangeDefaultExample;

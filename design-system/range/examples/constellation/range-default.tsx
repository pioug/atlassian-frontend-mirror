import React from 'react';

import { Label } from '@atlaskit/form';

import Range from '../../src';

const RangeDefaultExample = () => (
	<>
		<Label htmlFor="range-input">Adjust volume</Label>
		<Range id="range-input" step={1} min={1} max={100} />
	</>
);

export default RangeDefaultExample;

import React from 'react';

import { Label } from '@atlaskit/form';

import Range from '../src';

const SimpleRange = () => (
	<>
		<Label htmlFor="range-uncontrolled">Uncontrolled</Label>
		<Range id="range-uncontrolled" step={1} onChange={(value) => console.log('new value', value)} />
	</>
);

export default SimpleRange;

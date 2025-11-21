import React from 'react';

import Toggle from '@atlaskit/toggle';

import { Label } from './label';

export default function Example(): React.JSX.Element {
	return (
		<>
			<Label htmlFor="toggle-large">Allow pull requests</Label>
			<Toggle id="toggle-large" size="large" />
		</>
	);
}

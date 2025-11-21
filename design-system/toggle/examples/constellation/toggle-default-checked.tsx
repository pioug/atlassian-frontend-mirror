import React from 'react';

import Toggle from '@atlaskit/toggle';

import { Label } from './label';

export default function Example(): React.JSX.Element {
	return (
		<>
			<Label htmlFor="toggle-default-checked">Allow pull requests</Label>
			<Toggle id="toggle-default-checked" defaultChecked />
		</>
	);
}
